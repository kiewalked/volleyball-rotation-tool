// Map of where each position will move to on the court.
let initialised = false;

// TODO: Need to implement one side rotating at a time. Right now, both sides rotate. This also means I need to be able to allocate a serving side in edit mode.
let topServing = true;
let nextServer = 9;

const zoneMap = {
  1: 1,
  2: 6,
  3: 5,
  4: 2,
  5: 3,
  6: 4,
  7: 4,
  8: 3,
  9: 2,
  10: 5,
  11: 6,
  12: 1,
};

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

  // TODO: Fix the rotation system to make it so only one side serves at a time.

  const courts = document.querySelectorAll('.court-side');

  let servingSide;
  if (topServing) {
    servingSide = courts[1].getElementsByClassName('court-square');
    receivingSide = courts[0].getElementsByClassName('court-square');
  } else {
    servingSide = courts[0].getElementsByClassName('court-square');
    receivingSide = courts[1].getElementsByClassName('court-square');
  }

  //* First loop through the serving side and rotate
  for (let i = 0; i < servingSide.length; i++) {
    const item = servingSide[i];
    // console.log(item);
    const order = item.style.order;
    item.style.order = rotations[order];
    item.querySelector('.label').innerHTML = zoneMap[item.style.order];
  }

  //* Now loop through the receiving side and find the next server
  findNextServer(receivingSide);
  renderView();

  topServing = !topServing;
  // update next server
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
    // * Hide the rotate button
    const rotateButton = document.querySelector('.rotate-button');
    rotateButton.style.display = 'none';

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
    }
  } else {
    const rotateButton = document.querySelector('.rotate-button');
    rotateButton.style.display = 'block';

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
    const side = topServing
      ? document
          .querySelectorAll('.court-side')[1]
          .getElementsByClassName('court-square')
      : document
          .querySelectorAll('.court-side')[0]
          .getElementsByClassName('court-square');
    findNextServer(side);
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
  if (!initialised) {
    applyOrdering();
    initialised = true;
  }

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

    const labelSpan = createElement('div', { class: 'label' });
    labelSpan.innerHTML = zoneMap[item.style.order];
    item.appendChild(labelSpan);
  }
}

function loadPDF(e) {
  const preview = document.querySelector('iframe');
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.addEventListener(
    'load',
    function () {
      preview.src = reader.result;
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }
}

function findNextServer(side) {
  console.log(side);
  for (let i = 0; i < side.length; i++) {
    const item = side[i];
    if (item.style.order === '4' || item.style.order === '9') {
      nextServer = item.querySelector('span').innerHTML;
    }
  }
  const nextServerSpan = document.querySelector('.next-server');
  nextServerSpan.innerHTML = `Next Server: ${nextServer}`;
}

window.onload = renderView();
