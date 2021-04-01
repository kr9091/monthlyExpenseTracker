addEventListener('DOMContentLoaded', getBillToBeDeleted);

document.getElementById('delete-form').addEventListener('submit', deleteBill);

async function getBillToBeDeleted() {
    const billName = document.getElementById('Name');
    const billCost = document.getElementById('Cost');
    const billDueDate = document.getElementById('dueDate');
    const billCategory = document.getElementById('category');
    const params = window.location.search;
    const parseParams = new URLSearchParams(params);
    const currentBill = parseParams.get('id');

    await fetch(`http://localhost:3000/bills/${currentBill}`)
        .then((res) => res.json())
        .then((data) => {
            billName.value = data.name;
            billCost.value = data.cost;
            // Format Date into a readable format (M-DD-YYYY)
            const formattedDueDate = new Date(data.dueDate);
            const dueMonths = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];
            const dueDay = formattedDueDate.getDate();
            const dueMonth = dueMonths[formattedDueDate.getMonth()];
            const dueYear = formattedDueDate.getFullYear();

            const newDueDate =
                `${dueMonth}` + '-' + `${dueDay}` + '-' + `${dueYear}`;
            billDueDate.value = newDueDate;
            billCategory.value = data.category;
        });
}

async function deleteBill(e) {
    e.preventDefault();
    const params = window.location.search;
    const parseParams = new URLSearchParams(params);
    const currentBill = parseParams.get('id');

    await fetch(`http://localhost:3000/bills/${currentBill}`, {
        method: 'DELETE',
    });
    window.location.replace('http://localhost:5501/');
}
