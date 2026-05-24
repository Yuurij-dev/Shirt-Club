import { Lock, Mail } from "lucide-react";

const NewsletterSection = () => {
  return (
    <section className="w-full bg-white !px-4 !py-8 sm:!px-6 lg:!px-0">
      <div className="container !mx-auto">
        <div
          className="
            flex
            flex-col
            gap-6
            rounded-xl
            bg-zinc-100
            !px-6
            !py-8

            md:flex-row
            md:items-center
            md:justify-between

            lg:!px-12
          "
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              className="
                flex
                h-16
                w-16
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-black
                text-white

                sm:h-20
                sm:w-20
              "
            >
              <Mail size={34} />
            </div>

            <div>
              <h2
                className="
                  font-[family-name:var(--font-bebas)]
                  text-3xl
                  leading-none
                  text-zinc-950

                  sm:text-4xl
                "
              >
                RECEBA NOVIDADES <br />
                E PROMOÇÕES EXCLUSIVAS
              </h2>

              <p className="!mt-3 max-w-[360px] text-sm text-zinc-700">
                Cadastre seu e-mail e fique por dentro de tudo em primeira mão.
              </p>
            </div>
          </div>

          <div className="w-full md:max-w-[520px]">
            <form className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="
                  h-12
                  w-full
                  rounded-t-md
                  border
                  border-zinc-300
                  bg-white
                  !px-4
                  text-sm
                  outline-none

                  sm:rounded-l-md
                  sm:rounded-r-none
                "
              />

              <button
                type="submit"
                className="
                  h-12
                  rounded-b-md
                  bg-black
                  !px-8
                  text-sm
                  font-bold
                  text-white
                  transition-all
                  duration-200
                  hover:bg-zinc-800

                  sm:rounded-b-none
                  sm:rounded-r-md
                "
              >
                CADASTRAR
              </button>
            </form>

            <div className="!mt-3 flex items-center gap-2 text-xs text-zinc-600">
              <Lock size={13} />
              <span>Não compartilhamos seus dados com terceiros.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;