import { useEffect } from "react"
import { useNavigate } from "react-router";

export const Somos = ({setMenu}) => {
    useEffect(() => {
        setMenu(3)
    },[])
    const navigate = useNavigate();
    function log(){
        navigate("/Login", {
            replace: true
        })
    }
    useEffect(() => {
        setTimeout(() => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                backdrop.style.display = 'none';
            });
        }, 100);
    }, []);
    return (
        <>
            <div className="mt-4 company-info">
                <div className="content-index">
                    <div className="company-description">
                        <div className="text-left">
                            <p className="text-left">
                                <h4 style={{ "display": "inline-block" }}>Bienvenidos a <b className="fw-bold">BA-MRO</b></h4>, tu destino confiable para
                                obtener los mejores productos
                                industriales de la más alta calidad. Con más de una década de experiencia en la industria, nos
                                enorgullecemos de ofrecer una amplia gama de soluciones para las necesidades de automatización y
                                equipamiento industrial.</p>

                            <p className="text-left">Nuestro equipo de expertos está comprometido con la excelencia en cada paso del camino. Desde la selección
                                cuidadosa de marcas y fabricantes hasta el servicio al cliente de primer nivel, nos esforzamos por ser tu
                                socio confiable en todas tus necesidades industriales. Cada producto en nuestro catálogo ha sido
                                seleccionado pensando en brindar eficiencia, confiabilidad y satisfacción.</p>
                            <p className="text-left">Gracias por elegir BA-MRO. Esperamos ser tu fuente confiable para adquirir los mejores productos
                                industriales que impulsen tu éxito y crecimiento.</p>
                                <button onClick={() => log()} className="btn btn-dark" style={{"float":"right"}}>Regresar al login</button>
                            <img src="./assets/istockphoto-1413772251-612x612.jpg" alt="Imagen de la empresa" className="img-fluid" />
                        </div>

                    </div>
                    <div className="Diesño-bottom">
                        <div className="wave">
                            <div style={{ "display": "grid", "gridTemplateColumns": "50% 50%", "width": "100%", "height": "auto", "minHeight": "250px" }}>
                                <div className="d-flex text-center" style={{ "justifyContent": "center", "alignItems": "center", "color": "aliceblue" }} >
                                    <h1>Colaboladores</h1>
                                </div>
                                <div className="col-6">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ "backgroundColor" :"#2c2c2c" }}>
                <div className="row">
                    <div className="col-md-12">
                        <div>
                            <p style={{ "color": "#fff", "textAlign": "center" }}>En <b>BA-MRO</b> somos un grupo de integradoras con el fin de
                                proporcionar artículos con los que contamos o
                                productos que podemos adquirir para proporcionárselos a nuestros clientes.</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="collaborators">
                            <img src="./assets/logo-footer.png" alt="Colaborador 1" className="collaborator-logo" />
                            <div className="collaborator-name text-white">Badger <b style={{ "color": "goldenrod" }}>automation</b></div>
                            <p className="collaborator-role text-white">Fundador de <b>BA-MRO</b></p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="collaborators">
                            <img src="./assets/aplintec.png" alt="Colaborador 2" className="collaborator-logo" />
                            <div className="collaborator-name text-white"><b style={{ "color": "rgb(41,128,185)" }}>Aplintec</b></div>
                            <p className="collaborator-role text-white">Fundador de <b>BA-MRO</b></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4 mb-4">
                <div className="col-md-12">
                    <div className="clients-happy">
                    <h2 className="mb-4">Algunos de nuestros clientes</h2>
                    <div id="testimonialCarousel" className="carousel slide" data-ride="carousel">
                        <ol className="carousel-indicators">
                        <li data-target="#testimonialCarousel" data-slide-to="0" className="active"></li>
                        <li data-target="#testimonialCarousel" data-slide-to="1"></li>
                        <li data-target="#testimonialCarousel" data-slide-to="2"></li>
                        {/* Agrega más indicadores aquí si hay más testimonios */}
                        </ol>
                        <div className="carousel-inner">
                        <div className="carousel-item active">
                            <p>"Desde que comenzamos a trabajar con BA-MRO, hemos encontrado soluciones confiables para nuestras necesidades industriales. Su amplia gama de productos y excelente servicio al cliente nos ha permitido optimizar nuestra operación de manera significativa"</p>
                            <p className="client-name">- Uriel Isaías De León Salazar</p>
                        </div>
                        <div className="carousel-item">
                            <p>"Los productos suministrados por BA-MRO han demostrado una calidad excepcional. Cada vez que necesitamos equipos industriales, confiamos en ellos para obtener resultados superiores y un rendimiento constante en nuestras operaciones"</p>
                            <p className="client-name">- Erick Yael Gonzalez Ramirez</p>
                        </div>
                        {/* Agrega más items de testimonios aquí */}
                        <div className="carousel-item">
                            <p>"La rapidez en la entrega y la atención personalizada que recibimos es impresionante. Han demostrado ser un socio valioso para nuestras adquisiciones de productos industriales, siempre brindando soluciones eficientes y productos de alta calidad."</p>
                            <p className="client-name">- Ulises rodrigo moreno</p>
                        </div>
                        </div>
                        <a className="carousel-control-prev" href="#testimonialCarousel" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Anterior</span>
                        </a>
                        <a className="carousel-control-next" href="#testimonialCarousel" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Siguiente</span>
                        </a>
                    </div>
                    </div>
                </div>
            </div>
            <div style={{"width":"100%","height":"10vh"}}>

            </div>
        </>

    )
}