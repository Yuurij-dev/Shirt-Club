import Footer from "../components/Footer";
import Header from "../components/header";
import PageInDevelopment from "../components/PageInDevelopment";

const SalePage = () => {
    return ( 
        <div>
            <Header/>
            <main>
                <section className="container !mx-auto !px-4 !py-8 sm:!px-6 lg:!px-0">
                    <PageInDevelopment/>
                </section>

            </main>
            <Footer/>
        </div>
     );
}
 
export default SalePage;