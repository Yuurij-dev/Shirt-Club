import Link from "next/link";
import { notFound } from "next/navigation";
import EntityProductsSection from "@/app/components/EntityProductsSection";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/header";
import NewsletterSection from "@/app/components/NewsletterSection";
import OfertaHeader from "@/app/components/ofertaHeader";
import StoreHighlights from "@/app/components/StoreHighlights";
import { products } from "@/app/data/products";
import { getTeamBySlug, teams } from "@/app/data/teams";

type TeamPageProps = {
  params: Promise<{
    team: string;
  }>;
};

export const generateStaticParams = () => {
  return teams.map((team) => ({
    team: team.slug,
  }));
};

export const generateMetadata = async ({ params }: TeamPageProps) => {
  const { team: teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);

  if (!team) {
    return {
      title: "Time não encontrado | Shirt Club",
    };
  }

  return {
    title: `${team.name} | Shirt Club`,
    description: `Camisas do ${team.name} na Shirt Club.`,
  };
};

const TeamPage = async ({ params }: TeamPageProps) => {
  const { team: teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);

  if (!team) {
    notFound();
  }

  const teamProducts = products.filter(
    (product) => product.team === (team.productTeam || team.name)
  );

  return (
    <div>
      <OfertaHeader />
      <Header />

      <main className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
        <nav className="!mb-6 flex flex-wrap items-center !gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition-all duration-200 hover:text-black">
            Início
          </Link>
          <span>›</span>
          <Link
            href="/times"
            className="transition-all duration-200 hover:text-black"
          >
            Times
          </Link>
          <span>›</span>
          <span className="text-zinc-900">{team.name}</span>
        </nav>

        <EntityProductsSection
          title={team.name.toUpperCase()}
          description={`Confira as camisas disponíveis do ${team.name}.`}
          products={teamProducts}
          backHref="/times"
          backLabel="VOLTAR PARA TIMES"
        />

        <div className="!mt-10">
          <StoreHighlights />
        </div>

        <div className="!mt-4">
          <NewsletterSection />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeamPage;
