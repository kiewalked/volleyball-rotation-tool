// Map of where each position will move to on the court.
let initialised = false;

const rotations = {
  1: 2,
  2: 3,
  3: 6,
  4: 1,
  5: 4,
  6: 5,
  7: 8,
  8: 9,
  9: 12,
  10: 7,
  11: 10,
  12: 11,
};

const squareData = [
  {
    number: 1,
    role: 'setter',
  },
  {
    number: 2,
    role: 'middle',
  },
  {
    number: 3,
    role: 'outside',
  },
  {
    number: 4,
    role: 'outside',
  },
  {
    number: 5,
    role: 'middle',
  },
  {
    number: 6,
    role: 'opposite',
  },
  {
    number: 7,
    role: 'opposite',
  },
  {
    number: 8,
    role: 'middle',
  },
  {
    number: 9,
    role: 'outside',
  },
  {
    number: 10,
    role: 'outside',
  },
  {
    number: 11,
    role: 'middle',
  },
  {
    number: 12,
    role: 'setter',
  },
];

function rotate() {
  if (!initialised) {
    applyOrdering();
    initialised = true;
  }
  const childDivs = document.getElementsByClassName('court-square');
  for (let i = 0; i < childDivs.length; i++) {
    const item = childDivs[i];
    const order = item.style.order;
    // ? We need to loop through this list of childDivs and shuffle the order
    item.style.order = rotations[order];
  }
  for (let i = 1; i < 13; i++) {}
}

function applyOrdering() {
  for (let i = 1; i < 13; i++) {
    let orderedDiv = document.querySelector(`.item-${i}`);
    orderedDiv.style.order = `${i}`;
  }
  console.log('applied ordering successfully');
}

function toggleEditMode(e) {
  if (e.target.checked) {
    // ? Need to replace the innerHTML of each court-square with an input field & a dropdown menu for their role

    const childDivs = document.getElementsByClassName('court-square');
    for (let i = 0; i < childDivs.length; i++) {
      const item = childDivs[i];

      //? Create an input & dropdown menu
      const input = createElement('input', {
        type: 'number',
        placeholder: 'Number',
        value: squareData[i]['number'],
      });

      const select = document.createElement('select');

      // TODO: Definitely not the cleanest code I've written, could fix
      const setter = createElement('option', {
        value: 'setter',
      });
      const outside = createElement('option', {
        value: 'outside',
      });
      const opposite = createElement('option', {
        value: 'opposite',
      });
      const middle = createElement('option', {
        value: 'middle',
      });

      setter.innerHTML = 'Setter';
      outside.innerHTML = 'Outside';
      opposite.innerHTML = 'Opposite';
      middle.innerHTML = 'Middle';

      select.appendChild(setter);
      select.appendChild(outside);
      select.appendChild(opposite);
      select.appendChild(middle);

      switch (squareData[i]['role']) {
        case 'setter':
          setter.setAttribute('selected', '');
          break;
        case 'outside':
          outside.setAttribute('selected', '');
          break;
        case 'opposite':
          opposite.setAttribute('selected', '');
          break;
        case 'middle':
          middle.setAttribute('selected', '');
          break;
        default:
          break;
      }

      // TODO: ========== Fix up to here

      item.innerHTML = '';
      item.appendChild(input);
      item.appendChild(select);

      // TODO: Need to add in some way of validating the input from each square, and then storing it squareData. The two choices are to have an event listener which listens for every single time a value is updated, or simply read them all at once when we go back to view mode.

      // * Option 2 does seem better, but it means I need to track the selections. Alternatively, if I simply loop through all the court-squares, maybe I can go through sequentially and simply replace that square's data
    }
  } else {
    // ? Need to replace the innerHTML of each court-square with their assigned value, along with assigning the class based on the role from edit mode.

    const childDivs = document.getElementsByClassName('court-square');

    for (let i = 0; i < childDivs.length; i++) {
      const item = childDivs[i];

      const number = item.children[0].value;
      const role = item.children[1].value;

      squareData[i] = {
        number,
        role,
      };
    }

    renderView();
  }
}

function createElement(type, props) {
  let element = document.createElement(type);

  for (let prop in props) {
    element.setAttribute(prop, props[prop]);
  }
  // element.innerHTML = innerHTML;

  return element;
}

function renderView() {
  //? Removes existing attributes, reassigns them to based on squareData and creates a span with the respective number inside

  const childDivs = document.getElementsByClassName('court-square');
  for (let i = 0; i < childDivs.length; i++) {
    const item = childDivs[i];

    //* Set the role for that square
    item.classList.remove('setter');
    item.classList.remove('middle');
    item.classList.remove('outside');
    item.classList.remove('opposite');
    item.classList.add('class', squareData[i]['role']);

    //* Set the number for that square
    const span = document.createElement('span');
    span.innerHTML = squareData[i]['number'];
    item.innerHTML = '';
    item.appendChild(span);
  }
}

window.onload = renderView();
