addEventListener('DOMContentLoaded', getEditBill);

document
    .getElementById('edit-form')
    .addEventListener('submit', submitEditedBill);

async function getEditBill() {
    const billName = document.getElementById('editedName');
    const billCost = document.getElementById('editedCost');
    const billDueDate = document.getElementById('editedDueDate');
    const billPaidStatus = document.getElementById('editedPaidStatus');
    const billCategory = document.getElementById('editedCategory');
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
            billPaidStatus.checked = data.paid;
        });
}

async function submitEditedBill(e) {
    e.preventDefault();
    const updatedBillName = document.getElementById('editedName');
    const updatedBillCost = document.getElementById('editedCost');
    const updatedDueDate = document.getElementById('editedDueDate');
    const updatedPaidStatus = document.getElementById('editedPaidStatus');
    const updatedCategory = document.getElementById('editedCategory');
    const params = window.location.search;
    const parseParams = new URLSearchParams(params);
    const currentBill = parseParams.get('id');

    const checkbox = document.querySelector('input[type="checkbox"]');

    if (checkbox.checked == true) {
        updatedPaidStatus.value = true;
    } else {
        updatedPaidStatus.value = false;
    }

    let data = {
        name: updatedBillName.value,
        cost: updatedBillCost.value,
        dueDate: updatedDueDate.value,
        category: updatedCategory.value,
        paid: updatedPaidStatus.value,
    };

    console.log(data);

    await fetch(`http://localhost:3000/bills/${currentBill}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => console.log(data));

    window.location.replace('http://localhost:5501/');
}
