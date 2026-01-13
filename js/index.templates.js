(() => {
  function classAttr(...classes) {
    const cls = classes.filter(Boolean).join(' ');
    return cls ? ` class="${cls}"` : '';
  }

  function buildStemCell(cfg) {
    const liClass = classAttr(cfg.liClass);
    const tenSinClass = classAttr('ten_sin', cfg.tenSinClass);
    const eumYangClass = classAttr('eum_yang', cfg.eumYangClass);
    const hanjaClass = classAttr(cfg.hanjaClass);
    const hanguelClass = classAttr('hanguel', cfg.hanguelClass);

    return (
      `<li${liClass}>` +
      `<p class="label">${cfg.label}</p>` +
      `<div id="${cfg.idBase}10sin"${tenSinClass}></div>` +
      `<div class="hanja_con">` +
      `<p id="${cfg.idBase}Eumyang"${eumYangClass}></p>` +
      `<b id="${cfg.idBase}Hanja"${hanjaClass}></b>` +
      `<p id="${cfg.idBase}Hanguel"${hanguelClass}></p>` +
      `</div>` +
      `</li>`
    );
  }

  function buildJjList(jjBase, jjItemClass) {
    const itemClass = classAttr(jjItemClass);
    return (
      `<ul class="jijanggan" id="${jjBase}Jj">` +
      `<li id="${jjBase}Jj1"${itemClass}></li>` +
      `<li id="${jjBase}Jj2"${itemClass}></li>` +
      `<li id="${jjBase}Jj3"${itemClass}></li>` +
      `</ul>`
    );
  }

  function buildTodayJjList(jjBase) {
    return (
      `<ul class="jijanggan" id="${jjBase}Jj">` +
      `<li id="${jjBase}Jj1"><span class="hidden_stem"></span><span id="${jjBase}Jj1_10sin" class="ten_sin_small"></span></li>` +
      `<li id="${jjBase}Jj2"><span class="hidden_stem"></span><span id="${jjBase}Jj2_10sin" class="ten_sin_small"></span></li>` +
      `<li id="${jjBase}Jj3"><span class="hidden_stem"></span><span id="${jjBase}Jj3_10sin" class="ten_sin_small"></span></li>` +
      `</ul>`
    );
  }

  function buildBranchCell(cfg) {
    const liClass = classAttr(cfg.liClass);
    const eumYangClass = classAttr('eum_yang', cfg.eumYangClass);
    const hanjaClass = classAttr(cfg.hanjaClass);
    const hanguelClass = classAttr('hanguel', cfg.hanguelClass);
    const tenSinClass = classAttr('ten_sin', cfg.tenSinClass);
    const woonClass = classAttr('woon_seong', cfg.woonClass);
    const sinClass = classAttr('sin_sal', cfg.sinClass);

    const jjBase = cfg.jjBase || cfg.idBase;
    const wsBase = cfg.wsBase || jjBase;

    const jjList = cfg.todayJj
      ? buildTodayJjList(jjBase)
      : buildJjList(jjBase, cfg.jjItemClass);

    const tenSin = cfg.includeTenSin === false
      ? ''
      : `<div id="${jjBase}10sin"${tenSinClass}></div>`;

    const woonSin = cfg.includeWoonSin === false
      ? ''
      : `<div id="${wsBase}12ws"${woonClass}></div><div id="${wsBase}12ss"${sinClass}></div>`;

    return (
      `<li${liClass}>` +
      `<div class="hanja_con">` +
      `<p id="${cfg.idBase}Eumyang"${eumYangClass}></p>` +
      `<b id="${cfg.idBase}Hanja"${hanjaClass}></b>` +
      `<p id="${cfg.idBase}Hanguel"${hanguelClass}></p>` +
      `</div>` +
      jjList +
      tenSin +
      woonSin +
      `</li>`
    );
  }

  function renderGrid(containerId, stemCells, branchCells) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    const html = stemCells.map(buildStemCell).join('') + branchCells.map(buildBranchCell).join('');
    grid.innerHTML = html;
  }

  function renderTodaySaju() {
    renderGrid(
      'todaySajuGrid',
      [
        { label: '시주', idBase: 'todayHt', liClass: 'siju_con' },
        { label: '일주', idBase: 'todayDt' },
        { label: '월주', idBase: 'todayMt' },
        { label: '연주', idBase: 'todayYt' }
      ],
      [
        { idBase: 'todayHb', jjBase: 'todayHb', liClass: 'siju_con', todayJj: true, includeTenSin: false, includeWoonSin: false },
        { idBase: 'todayDb', jjBase: 'todayDb', todayJj: true, includeTenSin: false, includeWoonSin: false },
        { idBase: 'todayMb', jjBase: 'todayMb', todayJj: true, includeTenSin: false, includeWoonSin: false },
        { idBase: 'todayYb', jjBase: 'todayYb', todayJj: true, includeTenSin: false, includeWoonSin: false }
      ]
    );
  }

  function renderMainWongook() {
    renderGrid(
      'wongookGrid',
      [
        { label: '시주', idBase: 'Ht', liClass: 'siju_con' },
        { label: '일주', idBase: 'Dt' },
        { label: '월주', idBase: 'Mt' },
        { label: '연주', idBase: 'Yt' }
      ],
      [
        { idBase: 'Hb', jjBase: 'Hb', liClass: 'siju_con' },
        { idBase: 'Db', jjBase: 'Db' },
        { idBase: 'Mb', jjBase: 'Mb' },
        { idBase: 'Yb', jjBase: 'Yb' }
      ]
    );
  }

  function renderMainMyowoon() {
    const inner = 'innerClear';
    renderGrid(
      'myowoonGrid',
      [
        { label: '시주', idBase: 'MyoHt', liClass: 'siju_con_ siju_con4 siju_con5', tenSinClass: inner, eumYangClass: inner, hanjaClass: inner, hanguelClass: inner },
        { label: '일주', idBase: 'MyoDt', liClass: 'siju_con_ siju_con4 siju_con5', tenSinClass: inner, eumYangClass: inner, hanjaClass: inner, hanguelClass: inner },
        { label: '월주', idBase: 'MyoMt', tenSinClass: inner, eumYangClass: inner, hanjaClass: inner, hanguelClass: inner },
        { label: '연주', idBase: 'MyoYt', tenSinClass: inner, eumYangClass: inner, hanjaClass: inner, hanguelClass: inner }
      ],
      [
        { idBase: 'MyoHb', jjBase: 'MyoHb', liClass: 'siju_con_ siju_con4 siju_con5', tenSinClass: inner, woonClass: inner, sinClass: inner, jjItemClass: inner, eumYangClass: inner, hanjaClass: inner, hanguelClass: inner },
        { idBase: 'MyoDb', jjBase: 'MyoDb', liClass: 'siju_con_ siju_con4 siju_con5', tenSinClass: inner, woonClass: inner, sinClass: inner, jjItemClass: inner, eumYangClass: inner, hanjaClass: inner, hanguelClass: inner },
        { idBase: 'MyoMb', jjBase: 'MyoMb', tenSinClass: inner, woonClass: inner, sinClass: inner, jjItemClass: inner, eumYangClass: inner, hanjaClass: inner, hanguelClass: inner },
        { idBase: 'MyoYb', jjBase: 'MyoYb', tenSinClass: inner, woonClass: inner, sinClass: inner, jjItemClass: inner, eumYangClass: inner, hanjaClass: inner, hanguelClass: inner }
      ]
    );
  }

  function renderWoonWrap() {
    const inner = 'innerClear';
    renderGrid(
      'woonWrapGrid',
      [
        { label: '세운', idBase: 'WSwt', tenSinClass: inner, eumYangClass: inner, hanjaClass: inner, hanguelClass: inner },
        { label: '월운', idBase: 'WMt', tenSinClass: inner, eumYangClass: inner, hanjaClass: inner, hanguelClass: inner },
        { label: '일운', idBase: 'WDt', liClass: 'siju_con4', tenSinClass: inner, eumYangClass: inner, hanjaClass: inner, hanguelClass: inner },
        { label: '시운', idBase: 'WTt', liClass: 'siju_con4', tenSinClass: inner, eumYangClass: inner, hanjaClass: inner, hanguelClass: inner }
      ],
      [
        { idBase: 'WSwb', jjBase: 'WSb', wsBase: 'WSWb', tenSinClass: inner, woonClass: inner, sinClass: inner, jjItemClass: inner, eumYangClass: inner, hanjaClass: inner },
        { idBase: 'WMb', jjBase: 'WMb', tenSinClass: inner, woonClass: inner, sinClass: inner, jjItemClass: inner, eumYangClass: inner, hanjaClass: inner },
        { idBase: 'WDb', jjBase: 'WDb', liClass: 'siju_con4', tenSinClass: inner, woonClass: inner, sinClass: inner, jjItemClass: inner, eumYangClass: inner, hanjaClass: inner },
        { idBase: 'WTb', jjBase: 'WTb', liClass: 'siju_con4', tenSinClass: inner, woonClass: inner, sinClass: inner, jjItemClass: inner, eumYangClass: inner, hanjaClass: inner }
      ]
    );
  }

  function renderCoupleGrid(containerId, prefix) {
    renderGrid(
      containerId,
      [
        { label: '시주', idBase: `${prefix}Ht`, liClass: 'siju_con3' },
        { label: '일주', idBase: `${prefix}Dt`, liClass: 'siju_con3' },
        { label: '월주', idBase: `${prefix}Mt`, liClass: 'siju_con3' },
        { label: '연주', idBase: `${prefix}Yt`, liClass: 'siju_con3' }
      ],
      [
        { idBase: `${prefix}Hb`, jjBase: `${prefix}Hb`, liClass: 'siju_con3' },
        { idBase: `${prefix}Db`, jjBase: `${prefix}Db` },
        { idBase: `${prefix}Mb`, jjBase: `${prefix}Mb` },
        { idBase: `${prefix}Yb`, jjBase: `${prefix}Yb` }
      ]
    );
  }

  function renderCoupleMyowoon(containerId, prefix) {
    renderGrid(
      containerId,
      [
        { label: '시주', idBase: `${prefix}MyoHt`, liClass: 'siju_con3' },
        { label: '일주', idBase: `${prefix}MyoDt`, liClass: 'siju_con3' },
        { label: '월주', idBase: `${prefix}MyoMt` },
        { label: '연주', idBase: `${prefix}MyoYt` }
      ],
      [
        { idBase: `${prefix}MyoHb`, jjBase: `${prefix}MyoHb`, liClass: 'siju_con3' },
        { idBase: `${prefix}MyoDb`, jjBase: `${prefix}MyoDb`, liClass: 'siju_con3' },
        { idBase: `${prefix}MyoMb`, jjBase: `${prefix}MyoMb` },
        { idBase: `${prefix}MyoYb`, jjBase: `${prefix}MyoYb` }
      ]
    );
  }

  function renderDaewoonList() {
    const list = document.getElementById('daewoonList');
    if (!list) return;
    const items = [];
    const dt10sinClasses = [
      'dt10sin1',
      'dt10sin2',
      'dt10sin3',
      'dt10sin4',
      'dt10sin3',
      'dt10sin3',
      'dt10sin3',
      'dt10sin3',
      'dt10sin3',
      'dt10sin3',
      'dt10sin3'
    ];
    for (let i = 1; i <= 11; i += 1) {
      const dt10sinClass = dt10sinClasses[i - 1];
      items.push(
        `<li id="daewoon_${i}" data-index="${i}">` +
        `<div class="dage w innerClear" id="Da${i}"></div>` +
        `<div class="${dt10sinClass} w innerClear" id="dt10sin${i}"></div>` +
        `<div class="ganji_w innerClear" id="DC_${i}"></div>` +
        `<div class="ganji_w innerClear" id="DJ_${i}"></div>` +
        `<div class="db10sin${i} w innerClear" id="db10sin${i}"></div>` +
        `<div class="dwoo${i} w innerClear" id="DwW${i}"></div>` +
        `<div class="dsin${i} w innerClear" id="Ds${i}"></div>` +
        `</li>`
      );
    }
    list.innerHTML = items.join('');
  }

  function renderSewoonList() {
    const list = document.getElementById('sewoonList');
    if (!list) return;
    const items = [];
    for (let i = 1; i <= 10; i += 1) {
      items.push(
        `<li id="Sewoon_${i}" data-index2="${i}" data-year="">` +
        `<div class="dyear w" id="Dy${i}"></div>` +
        `<div class="syear w" id="Sy${i}"></div>` +
        `<div class="st10sin${i} w" id="st10sin${i}"></div>` +
        `<div class="ganji_w" id="SC_${i}"></div>` +
        `<div class="ganji_w" id="SJ_${i}"></div>` +
        `<div class="sb10sin${i} w" id="sb10sin${i}"></div>` +
        `<div class="swoo1 w" id="SwW${i}"></div>` +
        `<div class="ssin1 w" id="Ss${i}"></div>` +
        `</li>`
      );
    }
    list.innerHTML = items.join('');
  }

  function renderMowoonList() {
    const list = document.getElementById('mowoonList');
    if (!list) return;

    const terms = [
      { index: 2, term: '입춘' },
      { index: 3, term: '경칩' },
      { index: 4, term: '청명' },
      { index: 5, term: '입하' },
      { index: 6, term: '망종' },
      { index: 7, term: '소서' },
      { index: 8, term: '입추' },
      { index: 9, term: '백로' },
      { index: 10, term: '한로' },
      { index: 11, term: '입동' },
      { index: 12, term: '대설' },
      { index: 1, term: '소한' }
    ];

    const items = terms.map((item, i) => {
      const num = i + 1;
      const motClass = num === 1 ? `t10sin${num}` : `mt${num}0sin${num}`;
      return (
        `<li id="Mowoon_${num}" data-index3="${item.index}" data-solar-term="${item.term}">` +
        `<div class="dmonth w" id="Dm${num}"></div>` +
        `<div class="${motClass} w" id="Mot10sin${num}"></div>` +
        `<div class="ganji_w" id="MC_${num}"></div>` +
        `<div class="ganji_w" id="MJ_${num}"></div>` +
        `<div class="mb${num}0sin${num} w" id="Mob10sin${num}"></div>` +
        `<div class="mwoo${num} w" id="MwW${num}"></div>` +
        `<div class="msin${num} w" id="Ms${num}"></div>` +
        `</li>`
      );
    });

    list.innerHTML = items.join('');
  }

  function init() {
    renderTodaySaju();
    renderMainWongook();
    renderMainMyowoon();
    renderWoonWrap();
    renderCoupleGrid('coupleMyGrid', 'C');
    renderCoupleMyowoon('coupleMyMyoGrid', 'C');
    renderCoupleGrid('couplePartnerGrid', 'CP');
    renderCoupleMyowoon('couplePartnerMyoGrid', 'CP');
    renderDaewoonList();
    renderSewoonList();
    renderMowoonList();
  }

  init();
})();
