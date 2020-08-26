/* eslint-disable */
const stripe = Stripe('pk_test_51HJmy2CVL1PSmkiXoRjqMkJzs7sC5r8r82uwZcHnCOhNq3Y0NPtSfoUAOxY8kMh4YU46Xg8p86FKlUiPHQHlceuc00965hO900');

const bookBtn = document.getElementById('book-tour');
if (bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { tourId }= e.target.dataset;
        bookTour(tourId);
    });
}

const bookTour = async tourId => {
    try {
        // 1) Get the Stripe checkout session from the server
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        // 2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });

    } catch(err) {
        console.log(err);
    }
    
}