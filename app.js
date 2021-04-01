addEventListener('DOMContentLoaded', getBills);
document
  .getElementById('add-expense__button')
  .addEventListener('click', showAddBill);

document.getElementById('bill-form').addEventListener('submit', addBill);

const tableBody = document.getElementById('table-body');
const spending = document.getElementById('spending');
const income = document.getElementById('income');
const netCashFlow = document.getElementById('net');

function showAddBill(e) {
  e.preventDefault();
  const billElement = document.getElementById('add-expense');
  if (billElement.style.display === 'none') {
    billElement.style.display = 'flex';
  } else {
    billElement.style.display = 'none';
  }
}

async function getBills() {
  await fetch('http://localhost:4000/bills')
    .then((res) => res.json())
    .then((data) => {
      data.forEach((bill) => {
        // create table row
        const trElement = document.createElement('tr');

        //add name column
        const nameElement = document.createElement('td');
        nameElement.innerHTML = bill.name;
        trElement.appendChild(nameElement);

        //add cost column
        const costElement = document.createElement('td');
        //format to currency
        const formattedCost = Intl.NumberFormat('en-us', {
          style: 'currency',
          currency: 'USD',
        }).format(bill.cost);
        costElement.innerHTML = formattedCost;
        trElement.appendChild(costElement);

        //add due date column
        const dueDateElement = document.createElement('td');
        // Format Date
        const formattedDueDate = new Date(bill.dueDate);
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
        const dueMonth =
          bill.paid === true
            ? dueMonths[formattedDueDate.getMonth() + 1]
            : dueMonths[formattedDueDate.getMonth()];

        const dueYear = formattedDueDate.getFullYear();

        const newDueDate =
          `${dueMonth}` + '-' + `${dueDay}` + '-' + `${dueYear}`;
        dueDateElement.innerHTML = newDueDate;
        trElement.appendChild(dueDateElement);

        //add category list
        const categoryElement = document.createElement('td');
        categoryElement.innerHTML = bill.category;
        trElement.appendChild(categoryElement);

        //add edited column
        const editedElement = document.createElement('td');
        // Format Date
        const formattedUpdatedDate = new Date(bill.updated_at);
        const updatedMonths = [
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
        const updatedDay = formattedUpdatedDate.getDate();
        const updatedMonth = updatedMonths[formattedUpdatedDate.getMonth()];
        const updatedYear = formattedUpdatedDate.getFullYear();

        const newUpdatedDate =
          `${updatedMonth}` + '-' + `${updatedDay}` + '-' + `${updatedYear}`;
        editedElement.innerHTML = newUpdatedDate;
        trElement.appendChild(editedElement);

        // add delete button
        const deleteElement = document.createElement('td');
        deleteElement.innerHTML = `<a href=deleteExpense.html?id=${bill._id}><i class="fas fa-trash"></i></a>`;
        trElement.appendChild(deleteElement);

        // add edit button
        const editElement = document.createElement('td');
        editElement.innerHTML = `<a href=editExpense.html?id=${bill._id}><i class="fa fa-edit" aria-hidden="true"></i></a>`;
        trElement.appendChild(editElement);

        // add paid checkbox
        const checkboxElement = document.createElement('td');
        if (bill.paid == true) {
          checkboxElement.innerHTML =
            '<input type="checkbox" name="paid_status" id="paid_status" checked disabled />';
        }
        if (bill.paid == false) {
          checkboxElement.innerHTML =
            '<input type="checkbox" name="paid_status" id="paid_status" disabled/>';
        }
        trElement.appendChild(checkboxElement);

        //Add all created elements "rows of data" to table body
        tableBody.appendChild(trElement);
      });
      //Seperate out cost variables
      const cost = data.map((bill) => {
        if (bill.cost > 0) {
          return parseInt(bill.cost);
        }
      });

      // add each cost together from new array in cost variable
      const total = cost.reduce((a, b) => {
        return a + b;
      });

      //append the results to the UI
      spending.innerHTML =
        'Total Monthly Spending: ' +
        Intl.NumberFormat('en-us', {
          style: 'currency',
          currency: 'USD',
        }).format(total);

      //Total Monthly Income
      const incomeAmount = parseInt(3400);
      income.innerHTML =
        'Total Monthly Income: ' +
        Intl.NumberFormat('en-us', {
          style: 'currency',
          currency: 'USD',
        }).format(incomeAmount);

      //Net amount each month
      const netAmount = incomeAmount - total;
      netCashFlow.innerHTML =
        'Net Income Each Month: ' +
        Intl.NumberFormat('en-us', {
          style: 'currency',
          currency: 'USD',
        }).format(netAmount);
    });
}

async function addBill(e) {
  e.preventDefault();
  const billName = document.getElementById('name');
  const billCost = document.getElementById('cost');
  const dueDate = document.getElementById('dueDate');
  const billCategory = document.getElementById('category');

  let data = {
    name: billName.value,
    cost: billCost.value,
    dueDate: dueDate.value,
    category: billCategory.value,
  };

  console.log(data);

  await fetch('http://localhost:3000/bills', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));

  billName.value = '';
  billCost.value = '';
  dueDate.value = '';
  billCategory.value = '';
  window.location.reload();
}
