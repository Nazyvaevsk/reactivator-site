"use client";

import { useState, ChangeEvent, FormEvent } from "react";

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    photos: "",
    description: "",
  });

  const handlePhotosChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    setPhotos(files);

    setErrors((prev) => ({
      ...prev,
      photos: files.length > 0 ? "" : "Добавьте хотя бы одну фотографию",
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

    if (photos.length === 0) {
      newErrors.photos = "Добавьте хотя бы одну фотографию";
    }

    if (!description.trim()) {
      newErrors.description = "Опишите, что произошло";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSending(true);

    try {
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("phone", phone.trim());
      formData.append("description", description.trim());

      photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const response = await fetch("/api/send-telegram", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ошибка отправки");
      }

      setIsSent(true);

      setName("");
      setPhone("");
      setDescription("");
      setPhotos([]);
      setErrors({
        name: "",
        phone: "",
        photos: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      alert("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setIsSending(false);
    }
  };

  const closeForm = () => {
    if (isSending) return;

    setIsFormOpen(false);
    setIsSent(false);
  };

  return (
    <main className="bg-black text-white">

      {/* HERO */}

      <section className="relative h-screen overflow-hidden">

        <img
          src="/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative z-10 flex h-full items-end">

          <div className="mx-auto w-full max-w-7xl px-6 pb-16 md:pb-24">

            <p className="mb-5 text-xs uppercase tracking-[0.45em] text-zinc-300">
              Омск
            </p>

            <h1 className="mb-6 text-5xl font-bold leading-none md:text-8xl">
              Реактиватор
            </h1>

            <p className="mb-5 max-w-4xl text-2xl text-zinc-100 md:text-5xl">
              Восстановление геометрии кузова после ДТП
            </p>

            <p className="mb-10 max-w-2xl text-base leading-relaxed text-zinc-200 md:text-lg">
              Сложные ДТП, перекосы кузова, нарушение силовой структуры,
              восстановление геометрии и контроль размеров.
            </p>

            <button
              type="button"
              onClick={() => {
                setIsFormOpen(true);
                setIsSent(false);
              }}
              className="w-full rounded-2xl bg-white px-8 py-5 text-lg text-black transition hover:bg-zinc-300 sm:w-auto"
            >
              Отправить фото повреждений
            </button>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
              Предварительная оценка повреждений и стоимости восстановления по фото
            </p>

          </div>

        </div>

      </section>

      {/* CASES */}

      <section className="bg-black px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="mb-12">

            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
              Реальные случаи
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Геометрия кузова
            </h2>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div className="overflow-hidden rounded-3xl bg-zinc-950">
              <img
                src="/case1.jpg"
                alt=""
                className="block w-full transition duration-500 hover:scale-[1.02]"
              />
            </div>

            <div className="overflow-hidden rounded-3xl bg-zinc-950">
              <img
                src="/case2.jpg"
                alt=""
                className="block w-full transition duration-500 hover:scale-[1.02]"
              />
            </div>

            <div className="overflow-hidden rounded-3xl bg-zinc-950">
              <img
                src="/case3.jpg"
                alt=""
                className="block w-full transition duration-500 hover:scale-[1.02]"
              />
            </div>

            <div className="overflow-hidden rounded-3xl bg-zinc-950">
              <img
                src="/case4.jpg"
                alt=""
                className="block w-full transition duration-500 hover:scale-[1.02]"
              />
            </div>

          </div>

        </div>

      </section>

      {/* CONTACTS */}

      <section className="bg-black px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-zinc-500">
            Контакты
          </p>

          <h2 className="mb-16 text-4xl font-bold md:text-6xl">
            Реактиватор
          </h2>

          <div className="space-y-6 text-lg text-zinc-300">

            <a
              href="https://2gis.ru/omsk/geo/70000001105268013"
              target="_blank"
              rel="noopener noreferrer"
              className="block transition hover:text-white"
            >
              📍 Омск, 3-я Молодежная 81/2
            </a>

            <a
              href="https://t.me/reaktivator_IA"
              target="_blank"
              rel="noopener noreferrer"
              className="block transition hover:text-white"
            >
              ✈️ Telegram — @reaktivator_IA
            </a>

            <a
              href="https://wa.me/79994547470"
              target="_blank"
              rel="noopener noreferrer"
              className="block transition hover:text-white"
            >
              💬 WhatsApp — 89994547470
            </a>

            <a
              href="tel:+79994547470"
              className="block transition hover:text-white"
            >
              📞 Телефон — 89994547470
            </a>

          </div>

        </div>

      </section>

      {/* FORM MODAL */}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

          <div className="relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-zinc-950 p-6 shadow-2xl md:p-9">

            <button
              type="button"
              onClick={closeForm}
              disabled={isSending}
              className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-2xl text-zinc-300 transition hover:bg-zinc-700 hover:text-white disabled:opacity-50"
            >
              ×
            </button>

            {isSent ? (

              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">

                <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl text-black">
                  ✓
                </div>

                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-zinc-500">
                  Заявка отправлена
                </p>

                <h2 className="mb-5 text-4xl font-bold">
                  Спасибо
                </h2>

                <p className="max-w-md text-lg leading-relaxed text-zinc-400">
                  Мы получили ваши фотографии и описание повреждений.
                  Свяжемся с вами по указанному телефону.
                </p>

                <button
                  type="button"
                  onClick={closeForm}
                  className="mt-10 rounded-2xl bg-white px-8 py-4 text-lg text-black transition hover:bg-zinc-300"
                >
                  Закрыть
                </button>

              </div>

            ) : (

              <form onSubmit={handleSubmit} noValidate>

                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-zinc-500">
                  Предварительная оценка
                </p>

                <h2 className="mb-12 pr-12 text-4xl font-bold md:text-5xl">
                  Отправить повреждения
                </h2>

                {/* NAME */}

                <div className="mb-7">

                  <label className="mb-3 block text-base text-zinc-300">
                    Ваше имя
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder="Как к вам обращаться"
                    className={`w-full rounded-2xl border bg-black px-6 py-5 text-lg text-white outline-none transition placeholder:text-zinc-600 ${
                      errors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-800 focus:border-zinc-500"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.name}
                    </p>
                  )}

                </div>

                {/* PHONE */}

                <div className="mb-7">

                  <label className="mb-3 block text-base text-zinc-300">
                    Телефон
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    placeholder="+7 900 000-00-00"
                    className={`w-full rounded-2xl border bg-black px-6 py-5 text-lg text-white outline-none transition placeholder:text-zinc-600 ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-800 focus:border-zinc-500"
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.phone}
                    </p>
                  )}

                </div>

                {/* PHOTOS */}

                <div className="mb-7">

                  <label className="mb-3 block text-base text-zinc-300">
                    Фотографии повреждений
                  </label>

                  <label
                    className={`flex cursor-pointer flex-wrap items-center gap-5 rounded-2xl border border-dashed bg-black p-5 transition ${
                      errors.photos
                        ? "border-red-500"
                        : "border-zinc-700 hover:border-zinc-500"
                    }`}
                  >

                    <span className="rounded-xl bg-white px-6 py-3 text-base text-black transition hover:bg-zinc-300">
                      Выбрать файлы
                    </span>

                    <span className="text-base text-zinc-400">
                      {photos.length > 0
                        ? `Выбрано файлов: ${photos.length}`
                        : "Файл не выбран"}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotosChange}
                      className="hidden"
                    />

                  </label>

                  {errors.photos ? (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.photos}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-zinc-600">
                      Можно выбрать несколько фотографий.
                    </p>
                  )}

                </div>

                {/* DESCRIPTION */}

                <div className="mb-8">

                  <label className="mb-3 block text-base text-zinc-300">
                    Что произошло?
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors((prev) => ({ ...prev, description: "" }));
                    }}
                    placeholder="Например: удар в переднюю часть, увело лонжерон..."
                    rows={5}
                    className={`w-full resize-none rounded-2xl border bg-black px-6 py-5 text-lg text-white outline-none transition placeholder:text-zinc-600 ${
                      errors.description
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-800 focus:border-zinc-500"
                    }`}
                  />

                  {errors.description && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.description}
                    </p>
                  )}

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full rounded-2xl bg-white px-8 py-5 text-lg text-black transition hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSending ? "Отправляем..." : "Отправить заявку"}
                </button>

                <p className="mt-4 text-center text-sm leading-relaxed text-zinc-600">
                  Нажимая кнопку, вы отправляете фотографии и контактные данные
                  для связи по заявке.
                </p>

              </form>

            )}

          </div>

        </div>
      )}

    </main>
  );
}