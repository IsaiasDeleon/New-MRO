import { Card } from "./Cards";

export const Novedades = () => {
    const data = [
        {
            id: 1,
            img: 1,
            empresa: "Badger",
            descripcion: "Tenis Puma Junior Unisex St Activate Zapato Deportivo Comodo",
            estrellas: 4,
            monto: 200
        },
        {
            id: 2,
            img: 2,
            empresa: "Badger",
            descripcion: "Lentes De Sol Hombre Polarizados Clásicos Uv400 De Piloto",
            estrellas: 2,
            monto: 100
        },
        {
            id: 3,
            img: 3,
            empresa: "Aplintec",
            descripcion: "Reloj Tsar Bomba Hombre Lujo Tonneau Cronógrafo Impermeable",
            estrellas: 5,
            monto: 100
        },
        {
            id: 4,
            img: 4,
            empresa: "Badger",
            descripcion: "Reloj Tsar Bomba Hombre Lujo Tonneau Cronógrafo Impermeable",
            estrellas: 5,
            monto: 700
        },
        {
            id: 5,
            img: 5,
            empresa: "Badger",
            descripcion: "Tenis Puma Junior Unisex St Activate Zapato Deportivo Comodo",
            estrellas: 4,
            monto: 200
        },
        {
            id: 6,
            img: 6,
            empresa: "Badger",
            descripcion: "Lentes De Sol Hombre Polarizados Clásicos Uv400 De Piloto",
            estrellas: 2,
            monto: 100
        },
        {
            id: 7,
            img: 7,
            empresa: "Aplintec",
            descripcion: "Reloj Tsar Bomba Hombre Lujo Tonneau Cronógrafo Impermeable",
            estrellas: 5,
            monto: 100
        },
        {
            id: 8,
            img: 8,
            empresa: "Badger",
            descripcion: "Reloj Tsar Bomba Hombre Lujo Tonneau Cronógrafo Impermeable",
            estrellas: 5,
            monto: 700
        }
    ];
    const data2 = [
        {
            id: 1,
            img: 5,
            empresa: "Badger",
            descripcion: "Tenis Puma Junior Unisex St Activate Zapato Deportivo Comodo",
            estrellas: 4,
            monto: 200
        },
        {
            id: 2,
            img: 6,
            empresa: "Badger",
            descripcion: "Lentes De Sol Hombre Polarizados Clásicos Uv400 De Piloto",
            estrellas: 2,
            monto: 100
        },
        {
            id: 3,
            img: 7,
            empresa: "Aplintec",
            descripcion: "Reloj Tsar Bomba Hombre Lujo Tonneau Cronógrafo Impermeable",
            estrellas: 5,
            monto: 100
        },
        {
            id: 4,
            img: 8,
            empresa: "Badger",
            descripcion: "Reloj Tsar Bomba Hombre Lujo Tonneau Cronógrafo Impermeable",
            estrellas: 5,
            monto: 700
        }
    ];
    return (
        <div className="padding4 contendorArticulo" >
            <div className="m-2" >
                <h2 className="TtitulosIndex">Articulos mas vendidos</h2>
                <div className="d-flex ProbandoScroll contenedorCards" style={{ "overflowX": "scroll" }}>
                    {data.map((data) => (
                        <Card key={data.id} {...data} />
                    ))}
                </div>
            </div>
            <div className="m-2">
                <h4>Nuevos articulos</h4>
                <div className="d-flex  ProbandoScroll contenedorCards " style={{ "overflowX": "scroll" }}>
                    {data2.map((d) => (
                        <Card key={d.id} {...d} />
                    ))}
                </div>
            </div>


        </div>
    )
}