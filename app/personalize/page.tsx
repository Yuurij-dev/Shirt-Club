import Footer from "../components/Footer";
import Header from "../components/header";
import PageInDevelopment from "../components/PageInDevelopment";

const PersonalizePage = () => {
    return ( 
        <div className="flex min-h-screen flex-col">
            <Header/>
            <main className="flex-1">
                <section className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
                    <PageInDevelopment/>
                </section>

            </main>
            <Footer/>
        </div>
     );
}
 
export default PersonalizePage;
