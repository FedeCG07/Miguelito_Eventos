import './EventCard.css'
import frederick from './unnamed.png'

function EventCard(event) {
    return (
        <div className="event-card">
            <div className='title'>
                <h1>Título de evento</h1>
            </div>

            <div className='card-body'>
                <img src={frederick} className="image" alt="evento" />

                <div className='details'>
                    <p><span class="bold-text">Descripción corta pero no tan corta: </span> bvdsiu gnokwe dsnriug ñsaohgod sanhgi asfdjkhjea sfdmnh jkliearjg iodwsfhgua wroslnjhgou iewrhn g u oref nghbhui rewahg bnr saiujhg bjiusrdugior eaguiardsñ jguidofajh gjkanedi urpgjediuo</p>
                    <p><span class="bold-text">fecha: </span> a definir</p>
                    <p><span class="bold-text">dirección: </span> mi casa</p>
                    <div className='details-bottom'>
                        <p>assisting / maximum</p>
                        <p className='price'>precio</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventCard;