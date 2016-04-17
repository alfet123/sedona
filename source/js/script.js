(function() {

  var mainHeader = document.querySelector(".main-header");
  var mainMenu = document.querySelector(".main-menu");
  var menuOpenBtn = document.querySelector("#menu-open-btn");

  menuOpenBtn.addEventListener("click", function() {
    mainMenu.classList.toggle('main-menu--hidden');
    mainHeader.classList.toggle('main-header--hide-menu');
  });

  var form = document.querySelector(".review");
  var dateDuration = form.querySelector("#date-duration");
  var memberAmount = form.querySelector("#member-amount");
  var memberTable = document.querySelector("#member-table");

  var rowTemplate = '<tr><td class="col-1"><label class="member__label" for="member-position-{{rowNumber}}">№</label><input class="member__input" type="text" name="member-position" id="member-position-{{rowNumber}}" value="{{rowNumber}}" readonly></td><td class="col-2"><label class="member__label" for="member-family-{{rowNumber}}">Фамилия:<span class="required-mark">*</span></label><input class="member__input" type="text" name="member-family" id="member-family-{{rowNumber}}" placeholder="Иванов" required></td><td class="col-3"><label class="member__label" for="member-name-{{rowNumber}}">Имя:<span class="required-mark">*</span></label><input class="member__input" type="text" name="member-name" id="member-name-{{rowNumber}}" placeholder="Петр" required></td><td class="col-4"><label class="member__label" for="member-patronymic-{{rowNumber}}">Отчество:</label><input class="member__input" type="text" name="member-patronymic" id="member-patronymic-{{rowNumber}}" placeholder="Александрович"></td></tr>';

  dateDuration.value = 14;
  memberAmount.value = 2;

  form.querySelector("#date-minus").addEventListener("click", function() {
    if (dateDuration.value > 0) {
      dateDuration.value--;
    }
  });

  form.querySelector("#date-plus").addEventListener("click", function() {
    dateDuration.value++;
  });

  dateDuration.addEventListener("change", function() {
    dateDuration.value = parseInt(dateDuration.value, 10);
    if (isNaN(dateDuration.value) || dateDuration.value < 0) {
      dateDuration.value = 0;
    };
  });

  function renderTable() {
    var membersContent = '';
    for (var i = 0; i < memberAmount.value; i++) {
      var newMember = Mustache.render(rowTemplate, {"rowNumber": i+1});
      membersContent += newMember;
    };
    memberTable.innerHTML = membersContent;
  }

  form.querySelector("#member-minus").addEventListener("click", function() {
    if (memberAmount.value > 0) {
      memberAmount.value--;
    }
    renderTable();
  });

  form.querySelector("#member-plus").addEventListener("click", function() {
    memberAmount.value++;
    renderTable();
  });

  memberAmount.addEventListener("change", function() {
    memberAmount.value = parseInt(memberAmount.value, 10);
    if (isNaN(memberAmount.value) || memberAmount.value < 0) {
      memberAmount.value = 0;
    };
    renderTable();
  });

  if (!("FormData" in window) || !("FileReader" in window)) {
    return;
  }

  var photoList = document.querySelector(".photo__list");
  var imgTemplate = '<img class="photo__image" src="{{imgSource}}" alt="{{fileName}}"><div class="photo__delete"></div><div class="photo__title">{{fileName}}</div>';
  var queue = [];

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    var data = new FormData(form);

    request(data, function(response) {
      console.log(response);
    });
  });

  function request(data, fn) {
    var xhr = new XMLHttpRequest();
    var time = (new Date()).getTime();

    xhr.open("post", "https://echo.htmlacademy.ru/adaptive?" + time);

    xhr.addEventListener("readystatechange", function() {
      if (xhr.readyState == 4) {
        fn(xhr.responseText);
      }
    });

    xhr.send(data);
  }

  form.querySelector("#select-file").addEventListener("change", function() {
    var files = this.files;

    for (var i = 0; i < files.length; i++) {
      preview(files[i]);
    }
  });

  function preview(file) {
    if (file.type.match(/image.*/)) {
      var reader = new FileReader();

      reader.addEventListener("load", function(event) {
        var newImage = Mustache.render(imgTemplate, {
          "imgSource": event.target.result,
          "fileName": file.name
        });

        var li = document.createElement("li");
        li.classList.add("photo__item");
        li.innerHTML = newImage;

        photoList.appendChild(li);

        li.querySelector(".photo__delete").addEventListener("click", function(event) {
          event.preventDefault();
          removePreview(li);
        });

        queue.push({
          "file": file,
          "li": li
        });
      });

      reader.readAsDataURL(file);
    }
  }

  function removePreview(li) {
    queue = queue.filter(function(element) {
      return element.li != li;
    });
    
    li.parentNode.removeChild(li);
  }

})();
