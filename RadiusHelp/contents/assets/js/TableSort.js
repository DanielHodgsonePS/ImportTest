const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
  v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

var alltables = [];
var allValidTables = [];
var originalTables = [];
var allValidTableHeadings = [];
var stylesheet;
var rootContext;


function getValidTables() {
  allTables = Array.from(document.querySelectorAll("table"));
  allValidTables = allTables.filter(table => table.querySelector(".t1st") != null);
}

function assignTableDataAttribs() {

  for (i = 0; i < allValidTables.length; i++) {

    var table = allValidTables[i];
    table.dataset.tableNumber = i;

    var headings = table.querySelector('.t1st').querySelectorAll("td");
    allValidTableHeadings.push(headings);

    headings.forEach(heading => {
      heading.dataset.clickCount = 0;
      heading.dataset.clickedLast = "false";
      var headingText = heading.querySelector("p");
      $(headingText).wrap("<div class='tableIconWrapper'>");
    });
  }
}


function cloneOriginalTables() {

  for (i = 0; i < allValidTables.length; i++) {
    table = allValidTables[i];
    var clone = $("table[data-table-number='" + i + "']").clone(true);
    originalTables.push(clone);
  }
}

function addInitialTableIcons() {

  var headings = document.querySelectorAll(".tableIconWrapper > p");

  for (i = 0; i < headings.length; i++) {
    var heading = headings[i];

    var icon = new Image();
    icon.id = "tableIcon" + i;
    icon.className = "tableIcon";
    heading.append(icon);
    css("#tableIcon" + i, "content", "URL('../Images/icons/unsorted.png')");
  }
}


function sortTables() {

  document.querySelectorAll('.t1st > td').forEach(td => {

    td.addEventListener('click', (() => {

      const table = td.closest('table');
      const tbody = table.querySelector('tbody');

      var currentHeading = td;
      var tableNum = table.dataset.tableNumber;
      var headings = Array.from(table.querySelectorAll('.t1st > td'));

      headings.forEach(heading => {

        var icon = heading.querySelector(".tableIconWrapper > p > img");
        css("#" + icon.id, "content", "URL('..Images/icons/unsorted.png')");

        heading.dataset.clickedLast = "false";
        currentHeading.dataset.clickedLast = "true";

        if (heading.dataset.clickedLast == "false") {
          heading.dataset.clickCount = 0;
        }
      });

      var currClickCount = parseInt(currentHeading.dataset.clickCount);
      var newClickCount = currClickCount + 1;
      currentHeading.dataset.clickCount = newClickCount;

      if (currentHeading.dataset.clickCount % 3 == 0) {

        var icon = currentHeading.querySelector(".tableIconWrapper > p > img");
        css("#" + icon.id, "content", "URL('../Images/icons/unsorted.png')");

        var $clone = originalTables[tableNum].clone(true);
        $("table[data-table-number='" + tableNum + "']").replaceWith($clone);

        sortTables();
      }
      else if (currentHeading.dataset.clickCount % 2 == 0) {

        var icon = currentHeading.querySelector(".tableIconWrapper > p > img");
        css("#" + icon.id, "content", "URL('../Images/icons/sort-descending.png')");
      }
      else if (currentHeading.dataset.clickCount % 1 == 0) {

        var icon = currentHeading.querySelector(".tableIconWrapper > p > img");
        css("#" + icon.id, "content", "URL('../Images/icons/sort-ascending.png')");
      }

      Array.from(tbody.querySelectorAll('tr:not(.t1st)'))
        .sort(comparer(Array.from(td.parentNode.children).indexOf(td), this.asc = !this.asc))
        .forEach(tr => tbody.appendChild(tr));
    }
    ))
  });
}


// Used for mobile view 
function assignCollumnHeadingData() {

  for (i = 0; i < allValidTables.length; i++) {

    var table = allValidTables[i];
    var headingRow = table.querySelector('.t1st');

    if (null == headingRow)
      continue;

    var r = 1;

    while (row = table.rows[r++]) {

      var c = 0;

      while (cell = row.cells[c++]) {

        const heading = allValidTableHeadings[i][c - 1];

        if (typeof heading !== 'undefined')
          var headingText = heading.innerText;

        cell.dataset.title = headingText;
      }
    }
  }
}


function createIconStyleSheet() {
  // create a new stylesheet to hold IDs for table heading icons 
  // so they can be styled individually
  var style = document.createElement('style');
  document.head.appendChild(style);
  stylesheet = style.sheet;
}

// Update icon stylesheet containing table IDs to handle icon changes
function css(selector, property, value) {
  try {
    stylesheet.insertRule(selector + ' {' + property + ':' + value + '}', stylesheet.cssRules.length);
  }
  catch (err) { }
}


function tableInitFunctions() {

  var functions = [];
  functions.push(getValidTables);
  functions.push(assignTableDataAttribs);
  functions.push(assignCollumnHeadingData);
  functions.push(createIconStyleSheet);
  functions.push(addInitialTableIcons);
  functions.push(cloneOriginalTables);
  functions.push(sortTables);
  return functions;
}


tableInitFunctions().forEach(f => {
  window.addEventListener ?
    window.addEventListener("load", f, false) :
    window.attachEvent && window.attachEvent("onload", f);
})











