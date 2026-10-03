"use client";

import { createContext, useContext, useState, type ChangeEvent, type FormEvent, type MouseEvent, type ReactNode } from "react";

type ApplicationFormMode = "repair" | "body-dimensions" | "body-dimensions-search";

type ApplicationFormOptions = {
  groupId?: string;
  mode?: ApplicationFormMode;
  description?: string;
};

type OpenApplicationForm = (optionsOrEvent?: ApplicationFormOptions | MouseEvent<HTMLElement>) => void;

const ApplicationFormContext = createContext<OpenApplicationForm | null>(null);

export function useApplicationForm() {
  const openForm = useContext(ApplicationFormContext);
  if (!openForm) throw new Error("ApplicationFormProvider is required");
  return openForm;
}

export default function ApplicationFormProvider({ children }: { children: ReactNode }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const [formMode, setFormMode] = useState<ApplicationFormMode>("repair");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [purchaseGroupId, setPurchaseGroupId] = useState("");
  const [purchaseDescription, setPurchaseDescription] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const isSearch = formMode === "body-dimensions-search";
  const formDescription = formMode === "body-dimensions"
    ? purchaseDescription
    : isSearch ? searchDescription : description;
  const [photos, setPhotos] = useState<File[]>([]);

  const MAX_PHOTOS = 10;
  const MAX_TOTAL_PHOTO_SIZE = 100 * 1024 * 1024;

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    photos: "",
    description: "",
  });

  const handlePhotosChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const totalSize = files.reduce(
      (sum, file) => sum + file.size,
      0
    );

    if (files.length > MAX_PHOTOS) {
      setPhotos([]);
      setErrors((prev) => ({
        ...prev,
        photos: "Можно выбрать не более 10 фотографий",
      }));
      return;
    }

    if (totalSize > MAX_TOTAL_PHOTO_SIZE) {
      setPhotos([]);
      setErrors((prev) => ({
        ...prev,
        photos: "Общий размер фотографий не должен превышать 100 МБ",
      }));
      return;
    }

    setPhotos(files);

    setErrors((prev) => ({
      ...prev,
      photos:
        files.length > 0
          ? ""
          : "Добавьте хотя бы одну фотографию",
    }));
  };
  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
      photos: "",
      description: "",
    };

    if (!name.trim()) {
      newErrors.name = "Введите ваше имя";
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (!phone.trim()) {
      newErrors.phone = "Введите номер телефона";
    } else if (phoneDigits.length < 10) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    const totalPhotoSize = photos.reduce(
      (sum, file) => sum + file.size,
      0
    );

    if (formMode === "repair") {
      if (photos.length === 0) {
        newErrors.photos = "Добавьте хотя бы одну фотографию";
      } else if (photos.length > MAX_PHOTOS) {
        newErrors.photos = "Можно выбрать не более 10 фотографий";
      } else if (totalPhotoSize > MAX_TOTAL_PHOTO_SIZE) {
        newErrors.photos =
          "Общий размер фотографий не должен превышать 100 МБ";
      }
    }

    if (!formDescription.trim()) {
      newErrors.description = formMode === "body-dimensions"
        ? "Не указан комплект кузовных размеров"
        : isSearch ? "Укажите автомобиль и что нужно найти" : "Опишите, что произошло";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const preparePhotoForUpload = async (file: File): Promise<File> => {
    const MAX_SIZE = 8 * 1024 * 1024;

    if (file.size <= MAX_SIZE) {
      return file;
    }

    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });

    const qualities = [0.82, 0.75, 0.68, 0.60, 0.52, 0.45];
    const sizes = [2560, 2304, 2048, 1800];

    for (const maxSize of sizes) {
      const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));

      const width = Math.round(bitmap.width * scale);
      const height = Math.round(bitmap.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        bitmap.close();
        throw new Error("Не удалось подготовить фотографию");
      }

      ctx.drawImage(bitmap, 0, 0, width, height);

      for (const quality of qualities) {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", quality)
        );

        if (blob && blob.size <= MAX_SIZE) {
          bitmap.close();

          return new File(
            [blob],
            `${file.name.replace(/\.[^.]+$/, "")}.jpg`,
            {
              type: "image/jpeg",
            }
          );
        }
      }
    }

    bitmap.close();

    throw new Error(
      `Не удалось уменьшить фотографию "${file.name}" до допустимого размера`
    );
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSending) return;

    if (!validateForm()) {
      return;
    }

    setUploadedPhotos(0);
    setIsSending(true);

    try {
      if (formMode !== "repair") {
        const formData = new FormData();

        formData.append("name", name.trim());
        formData.append("phone", phone.trim());
        formData.append("description", formDescription.trim());
        formData.append("mode", formMode);
        if (formMode === "body-dimensions") formData.append("groupId", purchaseGroupId);
        formData.append("sendMessage", "true");

        const response = await fetch("/api/send-telegram", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Не удалось отправить заявку"
          );
        }
      }

      for (let i = 0; formMode === "repair" && i < photos.length; i++) {
        const photo = photos[i];
        const preparedPhoto = await preparePhotoForUpload(photo);

        const formData = new FormData();

        formData.append("name", name.trim());
        formData.append("phone", phone.trim());
        formData.append("description", formDescription.trim());
        formData.append("mode", formMode);
        formData.append("photo", preparedPhoto);
        formData.append("sendMessage", i === 0 ? "true" : "false");

        const response = await fetch("/api/send-telegram", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || `Не удалось отправить фотографию ${i + 1}`
          );
        }
        setUploadedPhotos(i + 1);
      }

      // Count one application only after every upload has succeeded.
      try {
        window.ym?.(113174477, "reachGoal", "lead_success");

        const gaWindow = window as typeof window & {
          gtag?: (...args: unknown[]) => void;
        };

        gaWindow.gtag?.("event", "generate_lead", {
          method: "application_form",
        });
      } catch {
        // Analytics must not interrupt a successfully submitted application.
      }

      setIsSent(true);

      setName("");
      setPhone("");
      if (formMode === "repair") {
        setDescription("");
        setPhotos([]);
      } else if (isSearch) {
        setSearchDescription("");
      } else {
        setPurchaseDescription("");
      }
      setErrors({
        name: "",
        phone: "",
        photos: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Не удалось отправить заявку. Попробуйте ещё раз."
      );
    } finally {
      setIsSending(false);
    }
  };
  const closeForm = () => {
    if (isSending) return;

    setIsFormOpen(false);
    setIsSent(false);
  };

  const openForm: OpenApplicationForm = (optionsOrEvent) => {
    if (isSending) return;

    // A direct onClick passes a React event, not form options.
    const options = optionsOrEvent && "nativeEvent" in optionsOrEvent
      ? undefined
      : optionsOrEvent;
    const mode = options?.mode ?? "repair";

    setFormMode(mode);
    setPurchaseGroupId(mode === "body-dimensions" ? options?.groupId ?? "" : "");

    if (mode === "body-dimensions") {
      setPurchaseDescription(options?.description ?? "");
    } else if (mode === "body-dimensions-search") {
      setSearchDescription(options?.description ?? "");
    } else if (options?.description !== undefined) {
      setDescription(options.description);
    }

    setErrors({ name: "", phone: "", photos: "", description: "" });

    setIsFormOpen(true);
    setIsSent(false);
  };

  return (
    <ApplicationFormContext.Provider value={openForm}>
      {children}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 text-white backdrop-blur-sm md:p-3 max-md:p-2">

          <div role="dialog" aria-modal="true" aria-label={isSearch ? "Заказать поиск кузовных размеров" : formMode === "body-dimensions" ? "Купить комплект кузовных размеров" : "Заявка на оценку повреждений"} className="relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-zinc-950 p-6 shadow-2xl md:p-7 max-md:max-h-[calc(100dvh-1rem)] max-md:overscroll-contain max-md:p-5">

            <button
              type="button"
              onClick={closeForm}
              aria-label="Закрыть форму"
              disabled={isSending}
              className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-2xl text-zinc-300 transition hover:bg-zinc-700 hover:text-white disabled:opacity-50 max-md:right-3 max-md:top-3 max-md:h-11 max-md:w-11 md:h-9.5 md:w-9.5 md:text-[20px] md:leading-[27px]"
            >
              ×
            </button>

            {isSent ? (

              <div className="flex min-h-[500px] md:min-h-[420px] flex-col items-center justify-center text-center">

                <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl text-black md:mb-5.5 md:h-16 md:w-16 md:text-[30px] md:leading-[34px]">
                  ✓
                </div>

                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-zinc-500 md:mb-2.5 max-md:pr-12 max-md:tracking-[0.12em]">
                  Заявка отправлена
                </p>

                <h2 className="mb-5 text-4xl font-bold md:mb-4 md:text-[30px] md:leading-[34px]">
                  Спасибо
                </h2>

                <p className="max-w-md text-lg leading-relaxed text-zinc-400 md:text-[17px]">
                  {isSearch
                    ? "Мы получили заявку на поиск кузовных размеров. Свяжемся с вами по указанному телефону."
                    : formMode === "body-dimensions"
                    ? "Мы получили вашу заявку на покупку комплекта кузовных размеров. Свяжемся с вами по указанному телефону."
                    : "Мы получили ваши фотографии и описание повреждений. Свяжемся с вами по указанному телефону."}
                </p>

                <button
                  type="button"
                  onClick={closeForm}
                  className="mt-10 rounded-2xl bg-white px-8 py-4 text-lg text-black transition hover:bg-zinc-300 md:mt-8 md:px-6.5 md:py-3 md:text-[17px] md:leading-[28px]"
                >
                  Закрыть
                </button>

              </div>

            ) : (

              <form onSubmit={handleSubmit} noValidate>

                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-zinc-500 md:mb-2.5 max-md:pr-12 max-md:tracking-[0.12em]">
                  {isSearch ? "Поиск по вашему автомобилю" : formMode === "body-dimensions" ? "Кузовные размеры" : "Предварительная оценка"}
                </p>

                <h2 className="mb-12 pr-12 text-4xl font-bold md:text-[40px] md:leading-[40px] md:mb-9.5 md:pr-9.5 max-md:mb-6 max-md:pr-0 max-md:text-[28px] max-md:leading-tight">
                  {isSearch ? "Заказать поиск кузовных размеров" : formMode === "body-dimensions" ? "Купить комплект кузовных размеров" : "Отправить повреждения"}
                </h2>

                {/* NAME */}

                <div className="mb-7 md:mb-5.5 max-md:mb-5">

                  <label className="mb-3 block text-base text-zinc-300 md:mb-2.5">
                    Ваше имя
                  </label>

                  <input
                    type="text"
                    disabled={isSending}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder="Как к вам обращаться"
                    className={`w-full rounded-2xl border bg-black px-6 py-5 text-lg max-md:px-4 max-md:py-3 max-md:text-base md:px-5 md:py-4 md:text-[17px] text-white outline-none transition placeholder:text-zinc-600 ${
                      errors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-800 focus:border-zinc-500"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400 md:mt-1.5">
                      {errors.name}
                    </p>
                  )}

                </div>

                {/* PHONE */}

                <div className="mb-7 md:mb-5.5 max-md:mb-5">

                  <label className="mb-3 block text-base text-zinc-300 md:mb-2.5">
                    Телефон
                  </label>

                  <input
                    type="tel"
                    disabled={isSending}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    placeholder="+7 900 000-00-00"
                    className={`w-full rounded-2xl border bg-black px-6 py-5 text-lg max-md:px-4 max-md:py-3 max-md:text-base md:px-5 md:py-4 md:text-[17px] text-white outline-none transition placeholder:text-zinc-600 ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-800 focus:border-zinc-500"
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-400 md:mt-1.5">
                      {errors.phone}
                    </p>
                  )}

                </div>

                {/* PHOTOS */}

                {formMode === "repair" && (
                  <div className="mb-7 md:mb-5.5 max-md:mb-5">

                    <label className="mb-3 block text-base text-zinc-300 md:mb-2.5">
                      Фотографии повреждений
                    </label>

                    <label
                      className={`flex cursor-pointer flex-wrap items-center gap-5 md:gap-4 rounded-2xl border border-dashed bg-black p-5 md:p-4 max-md:p-3 max-md:gap-3 transition ${
                        errors.photos
                          ? "border-red-500"
                          : "border-zinc-700 hover:border-zinc-500"
                      }`}
                    >

                      <span className="rounded-xl bg-white px-6 py-3 text-base text-black transition hover:bg-zinc-300 md:px-5 md:py-2.5">
                        Выбрать файлы
                      </span>

                      <span className="text-base text-zinc-400">
                        {photos.length > 0
                          ? `Выбрано файлов: ${photos.length}`
                          : "Файл не выбран"}
                      </span>

                      <input
                        type="file"
                        disabled={isSending}
                        accept="image/*"
                        multiple
                        onChange={handlePhotosChange}
                        className="hidden"
                      />

                    </label>

                    {errors.photos ? (
                      <p className="mt-2 text-sm text-red-400 md:mt-1.5">
                        {errors.photos}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-zinc-600 md:mt-1.5">
                        До 10 фотографий, общий размер — до 100 МБ.
                      </p>
                )}

                </div>

                )}

                {/* DESCRIPTION */}

                <div className="mb-8 md:mb-6.5">

                  <label className="mb-3 block text-base text-zinc-300 md:mb-2.5">
                    {isSearch ? "Автомобиль и что нужно найти" : formMode === "body-dimensions" ? "Комплект" : "Что произошло?"}
                  </label>

                  <textarea
                    disabled={isSending}
                    required
                    readOnly={formMode === "body-dimensions"}
                    value={formDescription}
                    onChange={(e) => {
                      if (isSearch) {
                        setSearchDescription(e.target.value);
                      } else {
                        setDescription(e.target.value);
                      }
                      setErrors((prev) => ({ ...prev, description: "" }));
                    }}
                    placeholder={isSearch
                      ? "Укажите марку, модель, год выпуска и какие кузовные размеры нужны. При необходимости добавьте тип кузова или VIN."
                      : "Например: удар в переднюю часть, увело лонжерон..."}
                    rows={5}
                    className={`w-full resize-none rounded-2xl border bg-black px-6 py-5 text-lg max-md:px-4 max-md:py-3 max-md:text-base md:px-5 md:py-4 md:text-[17px] text-white outline-none transition placeholder:text-zinc-600 ${
                      errors.description
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-800 focus:border-zinc-500"
                    }`}
                  />

                  {errors.description && (
                    <p className="mt-2 text-sm text-red-400 md:mt-1.5">
                      {errors.description}
                    </p>
                  )}

                </div>

                {/* SUBMIT */}

                <div className={isSending ? "sticky bottom-0 z-10 rounded-2xl bg-zinc-950 p-3 ring-1 ring-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.2)] sm:p-4" : ""}>
                  <button
                    type="submit"
                    disabled={isSending}
                    aria-busy={isSending}
                    className={`flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-5 text-base font-semibold transition sm:px-8 sm:text-lg md:px-6.5 md:py-4 md:text-[17px] max-md:min-h-14 max-md:py-3 disabled:cursor-wait ${isSending ? "bg-orange-500 text-black" : "bg-white text-black hover:bg-zinc-300"}`}
                  >
                    {isSending && (
                      <span
                        aria-hidden="true"
                        className="h-8 w-8 shrink-0 animate-spin rounded-full border-4 border-black/25 border-t-black motion-reduce:animate-none"
                      />
                    )}
                    {isSending
                      ? formMode !== "repair"
                        ? "Отправляем заявку..."
                        : "Отправляем фотографии..."
                      : isSearch
                        ? "Отправить заявку на поиск"
                        : formMode === "body-dimensions"
                        ? "Отправить заявку на покупку"
                        : "Отправить заявку"}
                  </button>

                  {isSending && (
                    <div role="status" aria-live="polite" aria-atomic="true" className="mt-4 text-center md:mt-3">
                      <p className="text-base font-semibold leading-relaxed text-orange-400">
                        Не закрывайте страницу — идёт отправка
                      </p>
                      {formMode === "repair" && (
                        <>
                          <p className="mt-2 text-sm text-white md:mt-1.5">
                            Отправлено фотографий: {uploadedPhotos} из {photos.length}
                          </p>
                          <div aria-hidden="true" className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800 md:mt-2.5">
                            <div
                              className="h-full rounded-full bg-orange-500 transition-[width] duration-300 motion-reduce:transition-none"
                              style={{ width: `${(uploadedPhotos / photos.length) * 100}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <p className="mt-4 text-center text-sm leading-relaxed text-zinc-600 md:mt-3">
                  {isSearch
                    ? "Нажимая кнопку, вы отправляете описание автомобиля и контактные данные для связи по заявке на поиск."
                    : formMode === "body-dimensions"
                    ? "Нажимая кнопку, вы отправляете данные комплекта и контактные данные для связи по заявке."
                    : "Нажимая кнопку, вы отправляете фотографии и контактные данные для связи по заявке."}
                </p>

              </form>

            )}

          </div>

        </div>
      )}

    </ApplicationFormContext.Provider>
  );
}
