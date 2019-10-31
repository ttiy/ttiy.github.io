window.onload = () => {
  //現在の年月の取得
  let current = new Date();
  //現在の年を取得
  let year = current.getFullYear();
  //現在の月を取得
  let month = current.getMonth() + 1;

  //カレンダーの表示
  let wrapper = document.querySelector('#calendar');
  add_calendar(wrapper, year, month);
}

// カレンダーの更新をする関数
function add_calendar(wrapper, year, month) {
  // 現在カレンダー(HTML要素)が追加されている場合は一旦削除する←これがないと順々にカレンダーが表示されてしまう
  wrapper.textContent = null;

  // カレンダーに表示する内容を取得
  let headData = generate_calendar_header(wrapper, year, month);
  let bodyData = generate_month_calendar(year, month);

  // カレンダーの要素を追加
  wrapper.appendChild(headData);
  wrapper.appendChild(bodyData);
}


// 指定した年月のカレンダーのヘッダー要素を生成して返す関数
function generate_calendar_header(wrapper, year, month) {
  //翌月を取得
  let nextMonth = new Date(year, (month - 1));
  //翌月を変数に設定
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  //前月を取得
  let prevMonth = new Date(year, (month - 1));
  //前月を変数に設定
  prevMonth.setMonth(prevMonth.getMonth() - 1);

  // ヘッダー要素のエレメントを生成
  let cHeader = document.createElement('div');
  cHeader.className = 'calendar-header';
  // 見出しのHTML要素を追加
  let cTitle = document.createElement('div');
  cTitle.className = 'calendar-header__title';
  let cTitleText = document.createTextNode(year + '年' + month + '月');
  // 作ったdiv要素にテキストを挿入
  cTitle.appendChild(cTitleText);
  // 作ったdiv要素をヘッダー要素に追加
  cHeader.appendChild(cTitle);

  // 前月ボタンの追加
  // button要素を追加
  let cPrev = document.createElement('button');
  cPrev.className = 'calendar-header__prev';
  // button要素のテキストを設定
  let cPrevText = document.createTextNode('prev');
  // 作ったbutton要素のテキストを追加
  cPrev.appendChild(cPrevText);
  // 前月ボタンをクリックした時のイベント設定
  cPrev.addEventListener('click', function () {
    add_calendar(wrapper, prevMonth.getFullYear(), (prevMonth.getMonth() + 1));
  }, false);
  // 作ったbutton要素を追加
  cHeader.appendChild(cPrev);

  // 翌月ボタンの追加
  // button要素を追加
  let cNext = document.createElement('button');
  cNext.className = 'calendar-header__next';
  // button要素のテキストを設定
  let cNextText = document.createTextNode('next');
  // 作ったbutton要素のテキストを追加
  cNext.appendChild(cNextText);
  // 翌月ボタンをクリックした時のイベント設定
  cNext.addEventListener('click', function () {
    add_calendar(wrapper, nextMonth.getFullYear(), (nextMonth.getMonth() + 1));
  }, false);
  // 作ったbutton要素を追加
  cHeader.appendChild(cNext);

  return cHeader;
}


// 指定した年月のカレンダー要素を生成して返す
function generate_month_calendar(year, month) {
  // 曜日の配列を生成
  let weekdayData = ['日', '月', '火', '水', '木', '金', '土'];
  // カレンダーの情報を取得
  let calendarData = get_month_calendar(year, month);

  // 初日の曜日を取得
  var i = calendarData[0]['weekday']; 
  // カレンダー上の初日より前を埋める
  while (i > 0) {
    i--;
    calendarData.unshift({
      day: '',
      weekday: i
    });
  }
  // 末日の曜日を取得
  var i = calendarData[calendarData.length - 1]['weekday'];
  // カレンダー上の末日より後を埋める
  while (i < 6) {
    i++;
    calendarData.push({
      day: '',
      weekday: i
    });
  }

  // カレンダーの要素を生成
  let cTable = document.createElement('table');
  cTable.className = 'calendar-table';


  let insertData = '';
  // 曜日部分の生成
  insertData += '<thead>';
  insertData += '<tr>';
  for (let i = 0; i < weekdayData.length; i++) {
    insertData += '<th>';
    insertData += weekdayData[i];
    insertData += '</th>';
  }
  insertData += '</tr>';
  insertData += '</thead>';

  // 日付部分の生成
  insertData += '<tbody>';
  for (let i = 0; i < calendarData.length; i++) {
    if (calendarData[i]['weekday'] <= 0) {
      insertData += '<tr>';
    }
    insertData += '<td>';
    insertData += calendarData[i]['day'];
    insertData += '</td>';
    if (calendarData[i]['weekday'] >= 6) {
      insertData += '</tr>';
    }
  }
  insertData += '</tbody>';

  cTable.innerHTML = insertData;
  return cTable;
}


// 指定した年月のカレンダー情報を返す
function get_month_calendar(year, month) {
  let firstDate = new Date(year, (month - 1), 1); // 指定した年月の初日の情報
  let lastDay = new Date(year, (firstDate.getMonth() + 1), 0).getDate(); // 指定した年月の末日
  let weekday = firstDate.getDay(); // 指定した年月の初日の曜日

  let calendarData = []; // カレンダーの情報を格納
  let weekdayCount = weekday; // 曜日のカウント用
  for (let i = 0; i < lastDay; i++) {
    calendarData[i] = {
      day: i + 1,
      weekday: weekdayCount
    }
    // 曜日のカウントが6(土曜日)まできたら0(日曜日)に戻す
    if (weekdayCount >= 6) {
      weekdayCount = 0;
    } else {
      weekdayCount++;
    }
  }
  return calendarData;
}