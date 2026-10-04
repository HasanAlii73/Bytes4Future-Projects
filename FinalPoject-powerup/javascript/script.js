
async function fetchAllProduct() {
    const skip = (currentPageNumber - 1) * itemsPerPage;
    const res = await fetch(`https://dummyjson.com/products?limit=100`);

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.products;
}

async function start() {
    const data = await fetchAllProduct();
    console.log(data);
}

start();    