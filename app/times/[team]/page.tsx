import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryBannerCarousel from "@/app/components/CategoryBannerCarousel";
import EntityProductsSection from "@/app/components/EntityProductsSection";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/header";
import NewsletterSection from "@/app/components/NewsletterSection";
import StoreHighlights from "@/app/components/StoreHighlights";
import { StoreBanner } from "@/app/data/banners";
import { getTeamBySlug, teams } from "@/app/data/teams";
import { listProducts } from "@/app/lib/productStore";

type TeamPageProps = {
  params: Promise<{
    team: string;
  }>;
};

const fallbackTimesBanner: StoreBanner = {
  id: "times-hero-default",
  name: "Banner padrão times",
  page: "times",
  position: "hero",
  desktopImageUrl: "/assets/banner/bannerTeams.png",
  title: "TIMES",
  linkUrl: "/times",
  isActive: true,
  sortOrder: 1,
};

export const generateStaticParams = () => {
  return teams.map((team) => ({
    team: team.slug,
  }));
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const ownerName = team.productTeam || team.name;
  const teamProducts = (await listProducts({ includeInactive: false })).filter(
    (product) => product.team === ownerName
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container !mx-auto flex-1 !px-4 !py-8 sm:!px-6 lg:!px-0">
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

        <CategoryBannerCarousel
          page="times"
          fallbackBanner={fallbackTimesBanner}
          heading="TIMES"
        />

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
