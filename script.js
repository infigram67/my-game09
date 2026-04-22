// ===== REICH & ROSES — SCRIPT.JS =====
// Политическая визуальная новелла, 1914–1945

// ===== СОСТОЯНИЕ ИГРЫ =====
const gameState = {
    player: {
        name: '',
        gender: '', // 'male' | 'female'
        rank: '',   // civilian, journalist, officer, diplomat, politician
        influence: 0,
        year: 1914,
        month: 0,
    },
    relations: {
        hitler: 50,
        stalin: 50,
        churchill: 50,
        mussolini: 50,
        hindenburg: 50,
    },
    flags: {},
    storyProgress: 0,
    currentScene: null,
    dialogueQueue: [],
    currentDialogueIndex: 0,
    isTyping: false,
    currentCharacter: null,
    saved: false,
};

// ===== ДАННЫЕ ПЕРСОНАЖЕЙ =====
const CHARACTERS = {
    hitler: {
        id: 'hitler',
        name: 'Адольф Гитлер',
        photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Bundesarchiv_Bild_183-H1216-0500-002%2C_Adolf_Hitler.jpg/400px-Bundesarchiv_Bild_183-H1216-0500-002%2C_Adolf_Hitler.jpg',
        sprite: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Bundesarchiv_Bild_183-H1216-0500-002%2C_Adolf_Hitler.jpg/400px-Bundesarchiv_Bild_183-H1216-0500-002%2C_Adolf_Hitler.jpg',
        title: 'Будущий Рейхсканцлер',
        relationKey: 'hitler',
        glowColor: '#8b1a1a',
    },
    stalin: {
        id: 'stalin',
        name: 'Иосиф Сталин',
        photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Joseph_Stalin_official_portrait.jpg/330px-Joseph_Stalin_official_portrait.jpg',
        sprite: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Joseph_Stalin_official_portrait.jpg/330px-Joseph_Stalin_official_portrait.jpg',
        title: 'Вождь СССР',
        relationKey: 'stalin',
        glowColor: '#c0392b',
    },
    churchill: {
        id: 'churchill',
        name: 'Уинстон Черчилль',
        photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sir_Winston_Churchill_-_19086236948.jpg/330px-Sir_Winston_Churchill_-_19086236948.jpg',
        sprite: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sir_Winston_Churchill_-_19086236948.jpg/330px-Sir_Winston_Churchill_-_19086236948.jpg',
        title: 'Премьер-министр Великобритании',
        relationKey: 'churchill',
        glowColor: '#1a3a6b',
    },
    mussolini: {
        id: 'mussolini',
        name: 'Бенито Муссолини',
        photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Mussolini_biografia.jpg/330px-Mussolini_biografia.jpg',
        sprite: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Mussolini_biografia.jpg/330px-Mussolini_biografia.jpg',
        title: 'Дуче Италии',
        relationKey: 'mussolini',
        glowColor: '#8b5a1a',
    },
    hindenburg: {
        id: 'hindenburg',
        name: 'Пауль фон Гинденбург',
        photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Paul_von_Hindenburg.jpg/330px-Paul_von_Hindenburg.jpg',
        sprite: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Paul_von_Hindenburg.jpg/330px-Paul_von_Hindenburg.jpg',
        title: 'Президент Германии',
        relationKey: 'hindenburg',
        glowColor: '#2a4a2a',
    },
    narrator: {
        id: 'narrator',
        name: '— Повествователь —',
        photo: '',
        sprite: '',
        title: '',
        relationKey: null,
        glowColor: '#888',
    }
};

// ===== ФРАЗЫ ГИТЛЕРА =====
// Гитлер — главный персонаж. Минимум 100 фраз, распределённых по уровням отношений и временным периодам.

const HITLER_DIALOGUES = {
    // --- ПЕРВАЯ ВСТРЕЧА ---
    firstMeet: [
        { text: "Вы... вы не местный. По глазам видно. Присядьте. Я не кусаюсь — пока.", relation: 50 },
        { text: "В этом кафе собираются все, кто чего-то стоит. Или думает, что стоит. К какой категории относитесь вы?", relation: 50 },
    ],

    // --- НЕЙТРАЛЬНЫЕ (отношения 30–65) ---
    neutral: [
        { text: "Германия — не просто страна. Это идея. Великая идея, которую пытаются задушить Версальским позором.", relation: 50 },
        { text: "Я был художником. Знаете ли вы это? Меня не приняли в Академию изящных искусств. Дважды. Возможно, они были правы... или нет.", relation: 50 },
        { text: "Вена научила меня многому. Я видел нищету. Я видел богатство. Я видел несправедливость во всей её наготе.", relation: 50 },
        { text: "Иногда я смотрю на звёзды и думаю — что оставлю я после себя? Имя? Или нечто большее?", relation: 50 },
        { text: "Мой отец Алоис никогда не понимал меня. Он хотел, чтобы я стал чиновником. Меня тошнит от одного этого слова.", relation: 50 },
        { text: "Мать умерла, когда мне было восемнадцать. Это... это было самое тяжёлое, что мне пришлось пережить. Больнее любого поражения.", relation: 50 },
        { text: "Политика — это искусство. Только холст здесь шире. И цена ошибки — не провал выставки, а гибель народа.", relation: 50 },
        { text: "Я читал много. Шопенгауэр, Ницше, Вагнер... Они говорили со мной так, как не говорил никто из живых.", relation: 50 },
        { text: "Солдатом я был... счастлив. Странно это звучит? На фронте всё просто: вот свои, вот враги. В жизни так не бывает.", relation: 50 },
        { text: "Мюнхен — мой город. Не Вена, не Берлин. Именно здесь я нашёл себя. Именно здесь меня услышали.", relation: 50 },
    ],

    // --- ДРУЖЕЛЮБНЫЕ (отношения 65–85) ---
    friendly: [
        { text: "Знаете... с вами приятно говорить. Вы слушаете. Большинство людей только делают вид.", relation: 70 },
        { text: "Я рисовал акварели. Архитектуру. Если бы меня приняли в Академию — кто знает, как сложилась бы история.", relation: 70 },
        { text: "Я не чудовище, как меня изображают. Я — человек с видением. Видением великой Германии.", relation: 70 },
        { text: "В окопах я думал: если выживу — сделаю что-то значимое. Не просто выживу, а стану голосом тех, кого не слышат.", relation: 70 },
        { text: "Ева... она единственная, кто принимает меня таким, какой я есть. Без политики. Без риторики. Просто — я.", relation: 70 },
        { text: "Архитектура — моя настоящая страсть. Если бы не война, не политика — я бы строил. Прекрасные, вечные здания.", relation: 70 },
        { text: "Почему вы со мной? Почему не уходите, не называете меня чудовищем, как другие?", relation: 70 },
        { text: "Иногда ночью мне снится мать. Клара. Она смотрит на меня. Я не могу понять — с гордостью или с укором.", relation: 70 },
        { text: "Я устал. Устал бороться. Но остановиться — значит предать тех, кто в меня верит. А их миллионы.", relation: 70 },
        { text: "Говорят, у меня нет сердца. Те, кто так говорит, никогда не видели меня наедине с собакой или ребёнком.", relation: 70 },
        { text: "Я мечтал о Берлине — столице мира. Германия, Рим, Москва... единая Европа под одним знаменем.", relation: 70 },
        { text: "Шпеер понимает архитектуру. Он построит Берлин таким, каким я его вижу. Величественным. Нетленным.", relation: 70 },
    ],

    // --- БЛИЗКИЕ ОТНОШЕНИЯ (отношения 85–100) ---
    close: [
        { text: "С вами я могу говорить иначе. Не как Фюрер. Просто — как Адольф. Маленький мальчик из Браунау-на-Инне.", relation: 85 },
        { text: "Моё детство не было счастливым. Отец бил. Мать терпела. Я рисовал. Это было моей крепостью.", relation: 85 },
        { text: "Иногда мне страшно. Да, страшно. Вы первый, кому я это говорю. Страшно не победить, а... разочаровать.", relation: 85 },
        { text: "Вы знаете, каково это — чувствовать себя непонятым? Всю жизнь? С самого детства?", relation: 85 },
        { text: "Я ненавижу одиночество. Но вокруг меня всегда люди — и я всё равно один. До недавнего времени.", relation: 85 },
        { text: "Если бы обстоятельства были иными... если бы не Версаль, не нищета, не унижение целого народа... я мог бы прожить тихую жизнь художника.", relation: 85 },
        { text: "Когда вы рядом — я думаю яснее. Это редкость. Бесценная редкость.", relation: 90 },
        { text: "Не смотрите на меня так. Я всего лишь человек, который несёт груз, который не выбирал... или выбрал. Я уже не уверен.", relation: 90 },
        { text: "Расскажите мне о себе. Я хочу знать. По-настоящему знать. Кто вы, когда никто не смотрит?", relation: 90 },
        { text: "Мне нравится, что вы не боитесь со мной спорить. Это... освежает. При мне все соглашаются.", relation: 90 },
    ],

    // --- РОМАНТИЧЕСКИЕ (отношения 90–100) ---
    romantic: [
        { text: "Я никогда не думал, что... что кто-то сможет так понять меня. Вы опасны для меня, знаете? В хорошем смысле.", relation: 90 },
        { text: "Когда вы уходите — в комнате становится меньше воздуха. Я замечаю это всякий раз.", relation: 92 },
        { text: "Посмотрите на этот закат. Я бы написал его акварелью. С вами рядом.", relation: 93 },
        { text: "Я не умею говорить красиво. Только с трибуны. Но вы... вы заставляете меня хотеть научиться.", relation: 93 },
        { text: "Приходите вечером. Я хочу показать вам кое-что. Мои эскизы Берлина будущего. Только вы увидите.", relation: 94 },
        { text: "Если бы у меня была другая жизнь... я бы посвятил её вам. Целиком. Без остатка.", relation: 95 },
        { text: "Не уходите. Пожалуйста. Просто посидите рядом. Молча. Этого достаточно.", relation: 95 },
        { text: "Я думаю о вас. Это... неуместно. Нерационально. Но это так.", relation: 96 },
        { text: "Знаете... я привык брать то, что хочу. Но вас — нельзя взять. Вас можно только завоевать. И это меня завораживает.", relation: 96 },
        { text: "Я люблю вас. Там, за пределами всей этой безумной истории — я люблю вас.", relation: 98 },
        { text: "С вами я понимаю, что значит быть живым. Не функционировать, не управлять — а жить.", relation: 98 },
        { text: "Когда всё это закончится — мы уедем. Куда-нибудь тихое. Горы. Обертзальцберг. Вместе.", relation: 99 },
        { text: "Вы — единственное, о чём я сожалею. О том, что мы встретились слишком поздно.", relation: 99 },
    ],

    // --- ССОРА / КОНФЛИКТ ---
    conflict: [
        { text: "Не смейте спорить со мной об этом! Вы не понимаете — не можете понять — что я несу на плечах!", relation: 30 },
        { text: "Разочарован. Искренне разочарован. Я думал, вы другой.", relation: 35 },
        { text: "Слова сказаны. Они не исчезнут. Но... я не хочу, чтобы это стояло между нами.", relation: 40 },
        { text: "Уйдите. Мне нужно побыть одному. Это не угроза. Просто... уйдите.", relation: 30 },
        { text: "Я не прощаю предательства. Запомните это.", relation: 20 },
    ],

    // --- ПРИМИРЕНИЕ ---
    reconcile: [
        { text: "Я... был груб. Это не оправдание. Просто констатация факта.", relation: 60 },
        { text: "Вернитесь. Я скучаю по нашим разговорам. Там — за всем этим шумом.", relation: 65 },
        { text: "Мы оба сказали лишнего. Давайте... начнём снова?", relation: 60 },
    ],

    // --- ИСТОРИИ ИЗ ДЕТСТВА ---
    childhood: [
        { text: "Мне было шесть лет, когда отец ударил меня за то, что я нарисовал на стене. Я не плакал. Я поклялся никогда больше не плакать.", relation: 80 },
        { text: "Мать пела мне по вечерам. Австрийские народные песни. У неё был тихий голос. Я до сих пор иногда слышу его.", relation: 80 },
        { text: "В школе я был лучшим в рисовании. Единственном. В остальном — посредственен. Отец говорил: 'Адольф, ты ни на что не годен.'", relation: 80 },
        { text: "Когда умер младший брат Эдмунд — мне было одиннадцать. После этого отец стал ещё суровее. Словно искал виновного.", relation: 82 },
        { text: "Линц — вот где прошло моё юношество. Маленький городок. Большие мечты. Несоответствие было... болезненным.", relation: 83 },
        { text: "Я верил, что стану великим художником. Или архитектором. Я верил в это так сильно, что отказывался видеть реальность.", relation: 83 },
        { text: "В Вене я ночевал в ночлежках. Ел чёрствый хлеб. Продавал открытки с видами города за гроши. Именно тогда я понял — мир несправедлив.", relation: 85 },
        { text: "Когда мать умирала от рака — я не отходил от её постели. Врач сказал потом, что никогда не видел такой преданности сына.", relation: 85 },
        { text: "Детство научило меня одному: никто не придёт на помощь. Надеяться можно только на себя. Только на себя.", relation: 80 },
        { text: "Отца я боялся и ненавидел. Мать обожал и терял. Может быть, поэтому мне так трудно с людьми, которые мне важны.", relation: 87 },
    ],

    // --- СОВМЕСТНЫЕ СОБЫТИЯ ---
    sharedEvents: [
        { text: "Пройдёмте. Я хочу показать вам Рейхстаг изнутри. Не как туристу — как... доверенному лицу.", relation: 85 },
        { text: "Сегодня вечером в Государственной Опере — Вагнер. Вы составите мне компанию?", relation: 87 },
        { text: "Берхтесгаден. Мой орлиный замок. Единственное место, где я дышу. Я хочу, чтобы вы увидели его.", relation: 90 },
        { text: "Мы едем в Мюнхен. Я покажу вам Хофбройхаус, где всё началось. Где меня впервые услышали.", relation: 88 },
    ],

    // --- ПОЛИТИЧЕСКИЕ РАЗГОВОРЫ ---
    politics: [
        { text: "Версальский договор — это не мир. Это приговор. И мы его не исполним.", relation: 50 },
        { text: "Веймарская республика прогнила насквозь. Коррупция, слабость, предательство. Германии нужна твёрдая рука.", relation: 50 },
        { text: "Я не хотел войны с Англией. Это британцы форсировали конфликт. История это признает.", relation: 55 },
        { text: "Россия — жизненное пространство. Lebensraum. Немецкий народ должен расширяться или погибнуть.", relation: 50 },
        { text: "Экономика — это война без выстрелов. И мы её уже выиграли. Посмотрите на автобаны. На заводы.", relation: 60 },
        { text: "Народ — это стадо. Жестоко? Нет. Честно. Стадо нуждается в пастыре. Я — пастырь.", relation: 50 },
        { text: "Мои враги делают из меня демона. Что ж. Демоны не нуждаются в оправдании — они действуют.", relation: 45 },
    ],

    // --- ВРАЖДЕБНЫЕ (отношения < 30) ---
    hostile: [
        { text: "Зачем вы здесь? Провоцировать? Шпионить? Убирайтесь.", relation: 20 },
        { text: "Я помню тех, кто предал меня. Я ничего не забываю.", relation: 15 },
        { text: "Вы мне неинтересны. И опасны. Держитесь подальше.", relation: 10 },
    ],

    // --- РЕАКЦИЯ НА ГЕНДЕР (женщина) ---
    toFemale: [
        { text: "Женщина в мире политики... необычно. Смело. Или безрассудно — посмотрим.", relation: 50 },
        { text: "Вы умны. Это редкость. В любом поле.", relation: 60 },
        { text: "Я уважаю силу. В вас есть сила. Это... привлекательно.", relation: 70 },
        { text: "Ева ревнует. Она права — вы занимаете мои мысли.", relation: 85 },
        { text: "Вы не похожи ни на кого, кого я знал.", relation: 90 },
    ],

    // --- РЕАКЦИЯ НА ГЕНДЕР (мужчина) ---
    toMale: [
        { text: "Крепкое рукопожатие. Хороший знак. Я доверяю первому впечатлению.", relation: 50 },
        { text: "Нам нужны такие люди в движении. Решительные. Умные.", relation: 60 },
        { text: "Мне не хватает собеседников. Настоящих. Остальные — лизоблюды.", relation: 75 },
        { text: "Вы можете стать частью чего-то грандиозного. Если захотите.", relation: 80 },
    ],
};

// ===== ФРАЗЫ СТАЛИНА =====
const STALIN_DIALOGUES = {
    firstMeet: [
        { text: "Кто вы? Откуда? Что хотите? Я не люблю людей, которые не отвечают сразу.", relation: 50 },
    ],
    neutral: [
        { text: "Германия интересна мне. Сильная Германия — это баланс. Баланс нам нужен.", relation: 50 },
        { text: "Я вырос в Гори. Бедная семья. Отец — сапожник. Это меня сделало тем, кто я есть.", relation: 50 },
        { text: "Ленин умер. Я продолжаю. Не повторяю — продолжаю. Это важное различие.", relation: 50 },
        { text: "Пакт с Гитлером? Стратегия. Чистая стратегия. Время нужно — и мы его купили.", relation: 50 },
        { text: "Смерть одного человека — трагедия. Смерть миллионов — статистика. Я знаю это лучше всех.", relation: 45 },
        { text: "Доверие — дорогой товар. Редкий. Вы ещё не заслужили.", relation: 50 },
        { text: "Россия — огромна. Управлять ею — значит держать страх в одной руке, надежду в другой.", relation: 50 },
        { text: "Я читал много. Маркс, Ленин, история. История — лучший учитель.", relation: 55 },
        { text: "Троцкий был умён. Но умных и верных редко бывает вместе. Он выбрал умный. Это его ошибка.", relation: 45 },
    ],
    friendly: [
        { text: "Вы умеете слушать. Это редкость среди дипломатов. Вы мне нравитесь — пока.", relation: 65 },
        { text: "Сталинград. Там решилась война. Там решилась история. Мои солдаты умирали за каждый камень.", relation: 70 },
        { text: "Я не боюсь Гитлера. Я понимаю его. Это разные вещи.", relation: 65 },
    ],
    romantic: [
        { text: "Надежда умерла рано. Я... не умею больше привязываться. Но вы — заставляете задуматься.", relation: 90 },
        { text: "Власть одинока. Невыносимо одинока. Иногда нужен просто человек рядом.", relation: 92 },
    ],
    hostile: [
        { text: "Провокатор. Я вас раскусил.", relation: 20 },
        { text: "В Сибири места много. Подумайте об этом.", relation: 10 },
    ],
};

// ===== ФРАЗЫ ЧЕРЧИЛЛЯ =====
const CHURCHILL_DIALOGUES = {
    neutral: [
        { text: "Мы будем сражаться на пляжах, мы будем сражаться на посадочных площадках... Простите, я немного увлёкся.", relation: 50 },
        { text: "Виски и сигара — основа британской дипломатии. Садитесь.", relation: 50 },
        { text: "Германия сильна. Это неоспоримо. Но Британия — непреклонна. Это тоже неоспоримо.", relation: 50 },
        { text: "Гитлер — опасный человек. Не потому что жесток. Потому что искренен.", relation: 45 },
        { text: "История будет добра ко мне — я намерен её написать.", relation: 55 },
        { text: "Пессимист видит трудности в каждой возможности. Оптимист — возможность в каждой трудности.", relation: 55 },
        { text: "Я никогда не сдаюсь. Это не храбрость — это упрямство. Но результат тот же.", relation: 60 },
    ],
    friendly: [
        { text: "Вы из Германии? И всё же пришли ко мне? Интересно. Очень интересно.", relation: 65 },
        { text: "Мы могли бы договориться с Германией. Если бы Гитлер не был... Гитлером.", relation: 70 },
    ],
    hostile: [
        { text: "Я не доверяю никому, кто работает с нацистами. Даже самому себе в таком контексте.", relation: 20 },
    ],
};

// ===== ФРАЗЫ МУССОЛИНИ =====
const MUSSOLINI_DIALOGUES = {
    neutral: [
        { text: "Italia! Рим! Цезарь создал империю — я воссоздам её.", relation: 50 },
        { text: "Фашизм — это не идеология. Это стиль жизни. Сильный. Решительный. Красивый.", relation: 50 },
        { text: "Гитлер — мой союзник. Иногда слишком импульсивный. Но союзник.", relation: 55 },
        { text: "Средиземное море — наше море. Mare Nostrum. Рим так и говорил.", relation: 50 },
        { text: "Народ любит силу. Презирает слабость. Это инстинкт. Я — воплощение их инстинкта.", relation: 50 },
    ],
    friendly: [
        { text: "Вы понимаете красоту власти. Я это вижу. Редкое качество.", relation: 65 },
        { text: "Мы с Гитлером — стальной союз. Ось Рим-Берлин. История запомнит нас вместе.", relation: 68 },
    ],
};

// ===== ФРАЗЫ ГИНДЕНБУРГА =====
const HINDENBURG_DIALOGUES = {
    neutral: [
        { text: "Я солдат старой закалки. Кайзер, честь, Германия. Эти ценности не устаревают.", relation: 50 },
        { text: "Гитлер... беспокоит меня. Но народ хочет его. А народ — это Германия.", relation: 50 },
        { text: "Война 1914-го... я помню каждый день. Каждый потерянный солдат.", relation: 55 },
        { text: "Я назначил его канцлером. Боюсь, история осудит меня за это.", relation: 45 },
        { text: "Дисциплина — основа армии. Основа государства. Основа цивилизации.", relation: 55 },
    ],
};

// ===== ОТВЕТЫ ИГРОКА =====
// Наборы вариантов ответов для разных ситуаций

const PLAYER_CHOICES = {
    // Реакция на первую встречу с Гитлером
    hitlerFirstMeet: [
        {
            text: "Я слышал о вас. Приятно познакомиться лично.",
            type: 'good',
            effect: +10,
            tag: 'friendly',
            responseKey: 'meetResponse_good'
        },
        {
            text: "Я ещё не определился, к какой категории отношусь.",
            type: 'neutral',
            effect: 0,
            tag: 'neutral',
            responseKey: 'meetResponse_neutral'
        },
        {
            text: "Категории меня не интересуют. Меня интересуют люди.",
            type: 'neutral',
            effect: +5,
            tag: 'curious',
            responseKey: 'meetResponse_curious'
        },
    ],

    // Реакция на политические взгляды
    hitlerPolitics: [
        {
            text: "Версальский договор действительно унизил Германию. Я понимаю вашу позицию.",
            type: 'good',
            effect: +12,
            tag: 'agree',
        },
        {
            text: "Война унизила всех. Германию — в числе прочих.",
            type: 'neutral',
            effect: -3,
            tag: 'balanced',
        },
        {
            text: "Сила не всегда решение. Иногда нужен диалог.",
            type: 'bad',
            effect: -10,
            tag: 'disagree',
        },
    ],

    // Реакция на детские воспоминания
    hitlerChildhood: [
        {
            text: "Вы рассказываете об этом впервые? Я слушаю.",
            type: 'good',
            effect: +15,
            tag: 'empathy',
        },
        {
            text: "Трудное детство объясняет многое, но не оправдывает всё.",
            type: 'neutral',
            effect: -5,
            tag: 'honest',
        },
        {
            text: "Мне жаль. Ни один ребёнок не заслуживает этого.",
            type: 'good',
            effect: +12,
            tag: 'compassion',
        },
        {
            text: "У многих трудное детство. Не все делают те же выборы.",
            type: 'bad',
            effect: -12,
            tag: 'challenge',
        },
    ],

    // Романтические ответы
    hitlerRomantic: [
        {
            text: "И я думаю о вас. Это не то, что я планировала/планировал.",
            type: 'good',
            effect: +15,
            tag: 'romantic',
        },
        {
            text: "Мир слишком сложен для таких слов между нами.",
            type: 'neutral',
            effect: -5,
            tag: 'reserved',
        },
        {
            text: "Вы — один из самых неожиданных людей в моей жизни.",
            type: 'good',
            effect: +10,
            tag: 'warm',
        },
        {
            text: "Не говорите о чувствах. Только о реальности.",
            type: 'bad',
            effect: -8,
            tag: 'cold',
        },
    ],

    // Ответ на признание в любви
    hitlerLoveConfession: [
        {
            text: "Я тоже. За пределами всего этого — я тоже.",
            type: 'good',
            effect: +20,
            tag: 'love',
        },
        {
            text: "Вы говорите это мне... но я не уверена/уверен.",
            type: 'neutral',
            effect: 0,
            tag: 'doubt',
        },
        {
            text: "Это невозможно. Нас разделяет слишком многое.",
            type: 'bad',
            effect: -15,
            tag: 'reject',
        },
    ],

    // Общие положительные ответы
    generalPositive: [
        { text: "Я понимаю вас.", type: 'good', effect: +8 },
        { text: "Расскажите мне больше.", type: 'good', effect: +10 },
        { text: "Я рядом.", type: 'good', effect: +12 },
        { text: "Ваши слова важны для меня.", type: 'good', effect: +8 },
    ],

    // Общие нейтральные ответы
    generalNeutral: [
        { text: "Продолжайте.", type: 'neutral', effect: 0 },
        { text: "Это сложно.", type: 'neutral', effect: 0 },
        { text: "Я думаю об этом.", type: 'neutral', effect: +2 },
    ],

    // Общие отрицательные ответы
    generalNegative: [
        { text: "Я не разделяю эту точку зрения.", type: 'bad', effect: -8 },
        { text: "Это ошибка.", type: 'bad', effect: -12 },
        { text: "Мне нужно время подумать.", type: 'bad', effect: -3 },
    ],
};

// ===== ИСТОРИЧЕСКИЕ СОБЫТИЯ =====
const HISTORICAL_EVENTS = [
    {
        year: 1914, month: 6,
        title: "Убийство в Сараево",
        desc: "28 июня 1914 года. Эрцгерцог Франц Фердинанд убит. Европа стоит на пороге войны. Германия встаёт рядом с Австрией.",
        scene: 'vienna',
        germanyStatus: 'Германская Империя',
        mood: 'напряжение',
        bgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Reichstag_building_Berlin_view_from_west_before_sunrise.jpg/1200px-Reichstag_building_Berlin_view_from_west_before_sunrise.jpg',
    },
    {
        year: 1914, month: 8,
        title: "Начало Первой Мировой Войны",
        desc: "Германия объявляет войну России и Франции. Войска маршируют через Бельгию. Берлин ликует — пока.",
        scene: 'war1914',
        germanyStatus: 'Германская Империя — Военное время',
        mood: 'военный патриотизм',
        bgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/German_troops_entering_Brussels_1914.jpg/1200px-German_troops_entering_Brussels_1914.jpg',
    },
    {
        year: 1916, month: 0,
        title: "Верден и Сомма",
        desc: "1916 год. Битва при Вердене. Миллионы жизней. Окопы превращаются в могилы. Германия держится, но цена — невыносима.",
        scene: 'trenches',
        germanyStatus: 'Военный тупик',
        mood: 'усталость и горе',
    },
    {
        year: 1918, month: 11,
        title: "Поражение и Революция",
        desc: "Ноябрь 1918. Кайзер отрёкся. Перемирие подписано. Германия в руинах. Революция на улицах. Конец Империи.",
        scene: 'ruins',
        germanyStatus: 'Веймарская Республика — Хаос',
        mood: 'отчаяние',
    },
    {
        year: 1919, month: 6,
        title: "Версальский Мирный Договор",
        desc: "28 июня 1919. Германия вынуждена принять унизительные условия мира. Репарации. Потеря территорий. Клеймо вины за войну. Народ в ярости.",
        scene: 'versailles',
        germanyStatus: 'Версальское унижение',
        mood: 'гнев и стыд',
    },
    {
        year: 1923, month: 11,
        title: "Пивной Путч",
        desc: "8 ноября 1923. Гитлер пытается захватить власть в Мюнхене. Путч провалился. Гитлер арестован. Но имя его теперь знает вся Германия.",
        scene: 'munich',
        germanyStatus: 'Политическая нестабильность',
        mood: 'смятение',
    },
    {
        year: 1929, month: 10,
        title: "Великая Депрессия",
        desc: "Крах Уолл-стрит ударил по всему миру. Германия — в эпицентре. Инфляция. Безработица. Миллионы на улицах. Отчаяние открывает двери для крайностей.",
        scene: 'depression',
        germanyStatus: 'Экономический коллапс',
        mood: 'отчаяние',
    },
    {
        year: 1933, month: 1,
        title: "Гитлер — Рейхсканцлер",
        desc: "30 января 1933. Гинденбург назначает Гитлера рейхсканцлером. НСДАП у власти. Германия вступает в новую эпоху — тёмную и грандиозную одновременно.",
        scene: 'berlin1933',
        germanyStatus: 'Третий Рейх — Начало',
        mood: 'экзальтация и страх',
    },
    {
        year: 1935, month: 9,
        title: "Нюрнбергские Законы",
        desc: "Сентябрь 1935. Приняты расовые законы. Германия меняется. Запахло чем-то страшным и необратимым.",
        scene: 'nuremberg',
        germanyStatus: 'Тоталитарный режим',
        mood: 'подавленность',
    },
    {
        year: 1938, month: 3,
        title: "Аншлюс — Австрия в составе Рейха",
        desc: "Март 1938. Германия присоединяет Австрию. Гитлер въезжает в Вену триумфатором. Карта Европы меняется.",
        scene: 'anschluss',
        germanyStatus: 'Рейх расширяется',
        mood: 'торжество',
    },
    {
        year: 1939, month: 9,
        title: "Начало Второй Мировой Войны",
        desc: "1 сентября 1939. Германия вторгается в Польшу. Британия и Франция объявляют войну. Мир снова горит.",
        scene: 'ww2start',
        germanyStatus: 'Третий Рейх — Война',
        mood: 'военный угар',
    },
    {
        year: 1941, month: 6,
        title: "Операция Барбаросса",
        desc: "22 июня 1941. Германия нападает на СССР. Три миллиона солдат. Гитлер нарушает пакт. Сталин в бешенстве. Восточный фронт — самый страшный театр войны в истории.",
        scene: 'barbarossa',
        germanyStatus: 'Война на два фронта',
        mood: 'опасное самоуверенное торжество',
    },
    {
        year: 1942, month: 11,
        title: "Сталинград — Перелом",
        desc: "Ноябрь 1942. Советское окружение под Сталинградом. 6-я армия в ловушке. Это начало конца для Рейха.",
        scene: 'stalingrad',
        germanyStatus: 'Стратегический кризис',
        mood: 'тревога и сомнения',
    },
    {
        year: 1944, month: 6,
        title: "День Д — Высадка в Нормандии",
        desc: "6 июня 1944. Союзники высаживаются во Франции. Западный фронт открыт. Германия зажата с двух сторон.",
        scene: 'dday',
        germanyStatus: 'Германия окружена',
        mood: 'обречённость',
    },
    {
        year: 1945, month: 4,
        title: "Конец Третьего Рейха",
        desc: "Апрель 1945. Советские войска в Берлине. 30 апреля — Гитлер мёртв. 8 мая — капитуляция. История закрывает страницу.",
        scene: 'end1945',
        germanyStatus: 'Германия капитулировала',
        mood: 'конец эпохи',
    },
];

// ===== СЦЕНАРИИ СЦЕН =====
// Каждая сцена — последовательность реплик + выборов

const SCENES = {

    intro: {
        bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Reichstag_building_Berlin_view_from_west_before_sunrise.jpg/1200px-Reichstag_building_Berlin_view_from_west_before_sunrise.jpg',
        dialogues: [
            { char: 'narrator', text: "Берлин. 1914 год. Европа ещё не знает, что стоит на краю пропасти." },
            { char: 'narrator', text: "Вы живёте в Германии. Германской Империи. Кайзер Вильгельм II правит страной. Но что-то в воздухе изменилось." },
            { char: 'narrator', text: "В мюнхенском кафе «Хофбройхаус» за угловым столиком сидит молодой человек с интенсивным взглядом. Он рисует на салфетке контуры зданий." },
        ],
        choicesAfter: 'hitlerFirstMeetScene',
    },

    hitlerFirstMeetScene: {
        bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Hofbraeuhaus_Muenchen.jpg/1200px-Hofbraeuhaus_Muenchen.jpg',
        dialogues: [
            { char: 'hitler', text: null, dialogueSet: 'firstMeet', index: 0 },
            { char: 'hitler', text: null, dialogueSet: 'firstMeet', index: 1 },
        ],
        choices: 'hitlerFirstMeet',
        nextScene: 'hitlerFirstMeet_response',
    },

    hitlerFirstMeet_response: {
        dialogues: [
            { char: 'narrator', text: "Он смотрит на вас — испытывающе, пронзительно. Но за жёсткостью есть что-то ещё. Любопытство?" },
            { char: 'hitler', text: null, dialogueSet: 'neutral', index: 0 },
            { char: 'hitler', text: null, dialogueSet: 'neutral', index: 7 },
        ],
        nextScene: 'event_1914',
    },

    hitlerChildhoodScene: {
        bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Reichstag_building_Berlin_view_from_west_before_sunrise.jpg/1200px-Reichstag_building_Berlin_view_from_west_before_sunrise.jpg',
        dialogues: [
            { char: 'narrator', text: "Гитлер молчит несколько секунд. Взгляд уходит куда-то далеко — в прошлое, которое он редко открывает." },
            { char: 'hitler', text: null, dialogueSet: 'childhood', index: 0 },
            { char: 'hitler', text: null, dialogueSet: 'childhood', index: 4 },
            { char: 'hitler', text: null, dialogueSet: 'childhood', index: 7 },
        ],
        choices: 'hitlerChildhood',
        nextScene: 'hitlerChildhood_response',
    },

    hitlerChildhood_response: {
        dialogues: [
            { char: 'hitler', text: null, dialogueSet: 'childhood', index: 9 },
            { char: 'narrator', text: "Он долго молчит. Что-то изменилось в его лице — стало мягче." },
            { char: 'hitler', text: null, dialogueSet: 'friendly', index: 1 },
        ],
        nextScene: 'hitlerPoliticsScene',
    },

    hitlerPoliticsScene: {
        dialogues: [
            { char: 'narrator', text: "Разговор переходит на политику. Его взгляд снова меняется — становится жёстче, убеждённее." },
            { char: 'hitler', text: null, dialogueSet: 'politics', index: 0 },
            { char: 'hitler', text: null, dialogueSet: 'politics', index: 1 },
        ],
        choices: 'hitlerPolitics',
        nextScene: 'hitlerPolitics_response',
    },

    hitlerPolitics_response: {
        dialogues: [
            { char: 'hitler', text: null, dialogueSet: 'neutral', index: 6 },
            { char: 'narrator', text: "Вы провели с ним несколько часов. Он говорил. Вы слушали. И думали." },
        ],
        nextScene: 'event_1914',
    },

    event_1914: {
        isEvent: true,
        eventIndex: 0, // ссылка на HISTORICAL_EVENTS[0]
        nextScene: 'stalinFirstMeetScene',
    },

    stalinFirstMeetScene: {
        bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Kremlin_27.06.2008.jpg/1200px-Kremlin_27.06.2008.jpg',
        dialogues: [
            { char: 'narrator', text: "Москва. Вы встречаете другого человека — холодного, как сибирская зима. Иосиф Сталин смотрит на вас без улыбки." },
            { char: 'stalin', text: null, dialogueSet: 'firstMeet', index: 0 },
            { char: 'narrator', text: "Он ждёт. Терпеливо. Словно у него бесконечно много времени — или бесконечно мало." },
        ],
        choices: 'hitlerFirstMeet', // используем похожие ответы
        nextScene: 'stalinResponse',
    },

    stalinResponse: {
        dialogues: [
            { char: 'stalin', text: null, dialogueSet: 'neutral', index: 1 },
            { char: 'stalin', text: null, dialogueSet: 'neutral', index: 3 },
        ],
        nextScene: 'event_ww1',
    },

    event_ww1: {
        isEvent: true,
        eventIndex: 1,
        nextScene: 'hitlerWar1Scene',
    },

    hitlerWar1Scene: {
        dialogues: [
            { char: 'narrator', text: "1915 год. Гитлер на фронте — ефрейтор, связной. Вы снова встречаете его. На этот раз — другого." },
            { char: 'hitler', text: null, dialogueSet: 'neutral', index: 8 },
            { char: 'hitler', text: null, dialogueSet: 'childhood', index: 8 },
        ],
        choices: 'generalPositive',
        nextScene: 'hitlerWar1_response',
    },

    hitlerWar1_response: {
        dialogues: [
            { char: 'hitler', text: null, dialogueSet: 'friendly', index: 0 },
            { char: 'hitler', text: null, dialogueSet: 'friendly', index: 5 },
        ],
        nextScene: 'event_verdun',
    },

    event_verdun: {
        isEvent: true,
        eventIndex: 2,
        nextScene: 'hitlerDeepTalkScene',
    },

    hitlerDeepTalkScene: {
        dialogues: [
            { char: 'narrator', text: "Вечер. Берлин, 1919 год. Гитлер вернулся с фронта. Войны больше нет. Но мира — тоже. Он сидит в пустой комнате." },
            { char: 'hitler', text: null, dialogueSet: 'friendly', index: 8 },
            { char: 'hitler', text: null, dialogueSet: 'friendly', index: 9 },
            { char: 'narrator', text: "Он смотрит на вас долго." },
        ],
        choices: 'hitlerChildhood',
        nextScene: 'hitlerDeep_response',
    },

    hitlerDeep_response: {
        dialogues: [
            { char: 'hitler', text: null, dialogueSet: 'friendly', index: 7 },
            { char: 'hitler', text: null, dialogueSet: 'childhood', index: 5 },
        ],
        nextScene: 'event_defeat',
    },

    event_defeat: {
        isEvent: true,
        eventIndex: 3,
        nextScene: 'hitlerVersionailScene',
    },

    hitlerVersionailScene: {
        dialogues: [
            { char: 'narrator', text: "1919 год. Версаль. Гитлер читает условия договора и плачет — впервые с детства, по его словам." },
            { char: 'hitler', text: null, dialogueSet: 'politics', index: 0 },
            { char: 'hitler', text: null, dialogueSet: 'politics', index: 2 },
            { char: 'hitler', text: null, dialogueSet: 'politics', index: 3 },
        ],
        choices: 'hitlerPolitics',
        nextScene: 'event_versailles',
    },

    event_versailles: {
        isEvent: true,
        eventIndex: 4,
        nextScene: 'hitlerRisingScene',
    },

    hitlerRisingScene: {
        dialogues: [
            { char: 'narrator', text: "1920-е. Гитлер набирает силу. Его речи собирают тысячи. Он другой — увереннее, жёстче. Но с вами — всё ещё откровенен." },
            { char: 'hitler', text: null, dialogueSet: 'politics', index: 4 },
            { char: 'hitler', text: null, dialogueSet: 'close', index: 0 },
        ],
        choices: 'hitlerChildhood',
        nextScene: 'hitlerRising_response',
    },

    hitlerRising_response: {
        dialogues: [
            { char: 'hitler', text: null, dialogueSet: 'close', index: 3 },
            { char: 'hitler', text: null, dialogueSet: 'close', index: 4 },
        ],
        nextScene: 'event_putsch',
    },

    event_putsch: {
        isEvent: true,
        eventIndex: 5,
        nextScene: 'hitlerPrisonScene',
    },

    hitlerPrisonScene: {
        dialogues: [
            { char: 'narrator', text: "Ландсбергская тюрьма. 1924 год. Вам разрешили кратко увидеться с ним. Он пишет книгу." },
            { char: 'hitler', text: null, dialogueSet: 'close', index: 5 },
            { char: 'hitler', text: null, dialogueSet: 'close', index: 6 },
        ],
        choices: 'generalPositive',
        nextScene: 'hitlerPrison_response',
    },

    hitlerPrison_response: {
        dialogues: [
            { char: 'hitler', text: null, dialogueSet: 'close', index: 7 },
            { char: 'hitler', text: null, dialogueSet: 'close', index: 8 },
            { char: 'narrator', text: "Он смотрит на вас — впервые по-настоящему уязвимо." },
        ],
        nextScene: 'event_depression',
    },

    event_depression: {
        isEvent: true,
        eventIndex: 6,
        nextScene: 'hitlerRomanticScene',
    },

    hitlerRomanticScene: {
        dialogues: [
            { char: 'narrator', text: "1931 год. Берлин. Поздний вечер. Вы снова вдвоём. Он говорит тихо — совсем не так, как с трибуны." },
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 0 },
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 1 },
            { char: 'narrator', text: "Тишина. Только звук Берлина за окном." },
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 3 },
        ],
        choices: 'hitlerRomantic',
        nextScene: 'hitlerRomantic_response',
    },

    hitlerRomantic_response: {
        dialogues: [
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 5 },
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 6 },
        ],
        nextScene: 'event_chancellorship',
    },

    event_chancellorship: {
        isEvent: true,
        eventIndex: 7,
        nextScene: 'hitlerPowerScene',
    },

    hitlerPowerScene: {
        dialogues: [
            { char: 'narrator', text: "30 января 1933. Гитлер — рейхсканцлер. Тысячи на улицах. Факельное шествие. Он смотрит с балона — и ищет вас глазами в толпе." },
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 8 },
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 9 },
        ],
        choices: 'hitlerRomantic',
        nextScene: 'hitlerLoveScene',
    },

    hitlerLoveScene: {
        dialogues: [
            { char: 'narrator', text: "Берхтесгаден. Осень 1934. Горы, тишина, закат над Альпами. Он написал вам — просил приехать." },
            { char: 'hitler', text: null, dialogueSet: 'sharedEvents', index: 2 },
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 10 },
            { char: 'narrator', text: "Он берёт вас за руку. Это — молчаливое признание." },
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 11 },
        ],
        choices: 'hitlerLoveConfession',
        nextScene: 'hitlerLove_response',
    },

    hitlerLove_response: {
        dialogues: [
            { char: 'narrator', text: "Слова сказаны. Обратного пути нет." },
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 12 },
        ],
        nextScene: 'event_ww2',
    },

    event_ww2: {
        isEvent: true,
        eventIndex: 8,
        nextScene: 'hitlerWar2Scene',
    },

    hitlerWar2Scene: {
        dialogues: [
            { char: 'narrator', text: "1939. Война. Он снова другой. Жёстче. Жёстче, чем вы когда-либо его видели." },
            { char: 'hitler', text: null, dialogueSet: 'politics', index: 5 },
            { char: 'narrator', text: "Он смотрит на вас — и в его глазах мелькает что-то, что было раньше. До войны." },
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 6 },
        ],
        choices: 'hitlerRomantic',
        nextScene: 'event_barbarossa',
    },

    event_barbarossa: {
        isEvent: true,
        eventIndex: 10,
        nextScene: 'hitlerArgueScene',
    },

    hitlerArgueScene: {
        dialogues: [
            { char: 'narrator', text: "1942. Между вами — первая настоящая ссора. О войне. О цене. О правде." },
            { char: 'hitler', text: null, dialogueSet: 'conflict', index: 0 },
            { char: 'narrator', text: "Он встаёт. Уходит. Но у двери останавливается." },
            { char: 'hitler', text: null, dialogueSet: 'conflict', index: 2 },
        ],
        choices: 'hitlerChildhood',
        nextScene: 'hitlerReconcileScene',
    },

    hitlerReconcileScene: {
        dialogues: [
            { char: 'narrator', text: "Несколько дней тишины. Потом — записка. 'Придите.' Без подписи. Но почерк вы знаете." },
            { char: 'hitler', text: null, dialogueSet: 'reconcile', index: 0 },
            { char: 'hitler', text: null, dialogueSet: 'reconcile', index: 1 },
        ],
        choices: 'generalPositive',
        nextScene: 'event_stalingrad',
    },

    event_stalingrad: {
        isEvent: true,
        eventIndex: 12,
        nextScene: 'hitlerFinalScene',
    },

    hitlerFinalScene: {
        bg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Bundesarchiv_Bild_183-V04744_Berlin_Reichskanzlei_Garten_zerstoert.jpg/800px-Bundesarchiv_Bild_183-V04744_Berlin_Reichskanzlei_Garten_zerstoert.jpg',
        dialogues: [
            { char: 'narrator', text: "Апрель 1945. Берлинский бункер. Советские орудия слышны над головой. Он позвал вас." },
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 9 },
            { char: 'narrator', text: "Он выглядит старше на двадцать лет. Дрожат руки. Но взгляд — всё тот же." },
            { char: 'hitler', text: null, dialogueSet: 'romantic', index: 12 },
            { char: 'hitler', text: null, dialogueSet: 'close', index: 9 },
            { char: 'narrator', text: "Вы молчите. За вас говорит всё, что между вами было. Годы. Слова. Тишина." },
        ],
        choices: 'hitlerLoveConfession',
        nextScene: 'ending',
    },

    ending: {
        dialogues: [
            { char: 'narrator', text: "30 апреля 1945. Берлин пал. История перевернула страницу." },
            { char: 'narrator', text: "Что осталось от этих лет? От разговоров, ссор, молчания и близости?" },
            { char: 'narrator', text: "История судит деяния. Но кто судит то, что происходит между людьми в тёмные времена?" },
            { char: 'narrator', text: "Конец первой части." },
        ],
        isEnding: true,
    },
};

// ===== ИГРОВЫЕ ПЕРЕМЕННЫЕ =====
let currentSceneId = null;
let currentDialogueIdx = 0;
let currentDialogues = [];
let isTyping = false;
let typeTimer = null;
let pendingChoices = null;
let pendingNextScene = null;

// ===== ИНИЦИАЛИЗАЦИЯ =====
window.addEventListener('DOMContentLoaded', () => {
    startLoading();
});

function startLoading() {
    const fill = document.getElementById('loadingFill');
    const txt = document.getElementById('loadingText');
    const messages = [
        "Загрузка истории...",
        "Подготовка персонажей...",
        "Читаем Версальский договор...",
        "Берлин, 1914 год...",
        "Добро пожаловать в историю.",
    ];
    let pct = 0;
    let mi = 0;
    const iv = setInterval(() => {
        pct += Math.random() * 15 + 5;
        if (pct > 100) pct = 100;
        fill.style.width = pct + '%';
        mi = Math.min(mi + 1, messages.length - 1);
        txt.textContent = messages[mi];
        if (pct >= 100) {
            clearInterval(iv);
            setTimeout(() => showScreen('mainMenu'), 800);
        }
    }, 400);
}

// ===== НАВИГАЦИЯ ПО ЭКРАНАМ =====
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
        s.style.opacity = '0';
    });
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'flex';
        setTimeout(() => {
            target.style.opacity = '1';
            target.classList.add('active');
        }, 20);
    }
}

// ===== ГЛАВНОЕ МЕНЮ =====
function startNewGame() {
    showScreen('charCreation');
    showStep('step-gender');
}

function loadGame() {
    const saved = localStorage.getItem('reichRosesSave');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.assign(gameState, data);
            showNotification('Игра загружена');
            startGameScreen();
        } catch(e) {
            showNotification('Сохранение не найдено');
        }
    } else {
        showNotification('Нет сохранения — начните новую игру');
    }
}

function showGallery() {
    showScreen('galleryScreen');
    buildGallery();
}

function buildGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    Object.values(CHARACTERS).forEach(c => {
        if (!c.photo) return;
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.innerHTML = `<img src="${c.photo}" alt="${c.name}" onerror="this.src='https://via.placeholder.com/200x250/1a1a24/c9a84c?text=${encodeURIComponent(c.name)}'"><div class="gallery-card-name">${c.name}</div>`;
        grid.appendChild(card);
    });
}

function showCredits() { showScreen('creditsScreen'); }
function backToMenu() { showScreen('mainMenu'); }
function showMenu() { showScreen('mainMenu'); }

// ===== СОЗДАНИЕ ПЕРСОНАЖА =====
function showStep(stepId) {
    document.querySelectorAll('.creation-step').forEach(s => s.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');
}

function setGender(g) {
    gameState.player.gender = g;
    showStep('step-name');
}

function setName() {
    const inp = document.getElementById('playerName');
    const name = inp.value.trim();
    if (!name) { showNotification('Введите имя'); return; }
    gameState.player.name = name;
    showStep('step-rank');
}

function setRank(rank) {
    gameState.player.rank = rank;
    const rankNames = {
        civilian: 'Гражданин',
        journalist: 'Журналист',
        officer: 'Офицер',
        diplomat: 'Дипломат',
        politician: 'Политик',
    };
    gameState.player.influence = rank === 'politician' ? 50 : rank === 'diplomat' ? 30 : rank === 'officer' ? 20 : rank === 'journalist' ? 15 : 5;
    updateStatusBar();
    startGameScreen();
}

// ===== ЗАПУСК ИГРЫ =====
function startGameScreen() {
    showScreen('gameScreen');
    updateStatusBar();
    updateRelationsSidebar();
    updateDateDisplay();
    playScene('intro');
}

// ===== СЦЕНЫ =====
function playScene(sceneId) {
    currentSceneId = sceneId;
    const scene = SCENES[sceneId];
    if (!scene) {
        console.warn('Unknown scene:', sceneId);
        return;
    }

    // Историческое событие
    if (scene.isEvent) {
        const ev = HISTORICAL_EVENTS[scene.eventIndex];
        if (ev) {
            advanceTime(ev.year, ev.month);
            showHistoricalEvent(ev, () => {
                if (scene.nextScene) playScene(scene.nextScene);
            });
        }
        return;
    }

    // Обновить фон
    if (scene.bg) {
        document.getElementById('sceneBg').style.background = `
            linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%),
            url('${scene.bg}') center/cover no-repeat`;
    }

    // Собрать диалоги
    currentDialogues = [];
    scene.dialogues.forEach(d => {
        if (d.text !== null && d.text !== undefined) {
            currentDialogues.push({ char: d.char, text: d.text });
        } else if (d.dialogueSet && CHARACTERS[d.char]) {
            const charDialogues = getCharDialogues(d.char, d.dialogueSet);
            const idx = d.index !== undefined ? d.index % charDialogues.length : 0;
            currentDialogues.push({ char: d.char, text: charDialogues[idx]?.text || '...' });
        }
    });

    // Применить гендерные реплики
    applyGenderDialogues();

    pendingChoices = scene.choices || null;
    pendingNextScene = scene.nextScene || null;

    // Конец игры?
    if (scene.isEnding) {
        pendingNextScene = null;
    }

    currentDialogueIdx = 0;
    hideChoices();
    showDialogue();
}

function getCharDialogues(charId, setName) {
    const sets = {
        hitler: HITLER_DIALOGUES,
        stalin: STALIN_DIALOGUES,
        churchill: CHURCHILL_DIALOGUES,
        mussolini: MUSSOLINI_DIALOGUES,
        hindenburg: HINDENBURG_DIALOGUES,
    };
    const charSets = sets[charId];
    if (!charSets) return [{ text: '...' }];
    return charSets[setName] || [{ text: '...' }];
}

function applyGenderDialogues() {
    // Уже встроено через систему выборов; здесь можно добавить постобработку
}

// ===== ДИАЛОГ =====
function showDialogue() {
    if (currentDialogueIdx >= currentDialogues.length) {
        // Конец диалогов сцены
        if (pendingChoices) {
            showChoices(pendingChoices);
        } else if (pendingNextScene) {
            playScene(pendingNextScene);
        } else {
            // Нет больше контента — показать меню или что-то завершить
            document.getElementById('continueBtn').style.display = 'none';
        }
        return;
    }

    const dial = currentDialogues[currentDialogueIdx];
    const char = CHARACTERS[dial.char] || CHARACTERS['narrator'];

    // Обновить аватар и имя
    setCurrentSpeaker(char);

    // Спрайт
    if (char.sprite && dial.char !== 'narrator') {
        const sprite = document.getElementById('characterSprite');
        sprite.src = char.sprite;
        sprite.style.display = 'block';
        sprite.onerror = () => { sprite.style.display = 'none'; };
        document.getElementById('characterGlow').style.boxShadow = `0 0 40px ${char.glowColor}40, 0 0 80px ${char.glowColor}20`;
    } else {
        document.getElementById('characterSprite').style.display = 'none';
        document.getElementById('characterGlow').style.boxShadow = 'none';
    }

    typeText(dial.text);
    document.getElementById('continueBtn').style.display = 'none';
}

function setCurrentSpeaker(char) {
    document.getElementById('speakerName').textContent = char.name;

    const avatar = document.getElementById('speakerAvatar');
    if (char.photo) {
        avatar.src = char.photo;
        avatar.style.display = 'block';
        avatar.onerror = () => {
            avatar.style.display = 'none';
        };
    } else {
        avatar.style.display = 'none';
    }

    // Мини бар отношений
    if (char.relationKey) {
        const rel = gameState.relations[char.relationKey] || 50;
        document.getElementById('relationFillMini').style.width = rel + '%';
        const ring = document.getElementById('relationRing');
        ring.style.borderColor = getRelationColor(rel);
    } else {
        document.getElementById('relationFillMini').style.width = '50%';
    }
}

let typeSpeed = 30; // ms per char

function typeText(text) {
    if (!text) { text = '...'; }
    const el = document.getElementById('dialogueText');
    const cursor = document.getElementById('textCursor');
    el.textContent = '';
    cursor.style.display = 'inline-block';
    isTyping = true;

    if (typeTimer) clearInterval(typeTimer);

    let i = 0;
    typeTimer = setInterval(() => {
        if (i < text.length) {
            el.textContent += text[i];
            i++;
        } else {
            clearInterval(typeTimer);
            isTyping = false;
            cursor.style.display = 'none';
            document.getElementById('continueBtn').style.display = 'block';
        }
    }, typeSpeed);
}

function nextDialogue() {
    if (isTyping) {
        // Пропустить анимацию
        clearInterval(typeTimer);
        const dial = currentDialogues[currentDialogueIdx];
        if (dial) document.getElementById('dialogueText').textContent = dial.text || '...';
        isTyping = false;
        document.getElementById('textCursor').style.display = 'none';
        document.getElementById('continueBtn').style.display = 'block';
        return;
    }

    currentDialogueIdx++;
    document.getElementById('continueBtn').style.display = 'none';
    showDialogue();
}

// ===== ВЫБОРЫ =====
function showChoices(choicesKey) {
    const choices = PLAYER_CHOICES[choicesKey];
    if (!choices) {
        // Продолжить без выбора
        if (pendingNextScene) playScene(pendingNextScene);
        return;
    }

    document.getElementById('continueBtn').style.display = 'none';
    document.getElementById('choicesPanel').style.display = 'block';

    const list = document.getElementById('choicesList');
    list.innerHTML = '';

    choices.forEach((ch, idx) => {
        const btn = document.createElement('button');
        btn.className = `choice-btn ${ch.type || 'neutral'}`;

        // Применить гендер к тексту
        let text = ch.text;
        if (gameState.player.gender === 'female') {
            text = text.replace(/планировал/g, 'планировала')
                       .replace(/уверен/g, 'уверена')
                       .replace(/рад/g, 'рада');
        }

        const effectStr = ch.effect > 0
            ? `<span class="choice-effect pos">+${ch.effect} ❤</span>`
            : ch.effect < 0
            ? `<span class="choice-effect neg">${ch.effect} ❤</span>`
            : '';

        btn.innerHTML = `${text} ${effectStr}`;
        btn.onclick = () => selectChoice(ch, choicesKey);
        list.appendChild(btn);
    });
}

function selectChoice(choice, choicesKey) {
    hideChoices();

    // Применить эффект к отношениям
    if (choice.effect && currentSceneId) {
        const scene = SCENES[currentSceneId];
        // Определить, с кем у нас диалог
        let targetChar = null;
        if (scene && scene.dialogues) {
            for (let d of scene.dialogues) {
                if (d.char && d.char !== 'narrator') {
                    targetChar = d.char;
                    break;
                }
            }
        }
        if (targetChar && gameState.relations[targetChar] !== undefined) {
            gameState.relations[targetChar] = Math.max(0, Math.min(100, gameState.relations[targetChar] + choice.effect));
            updateRelationsSidebar();
            const delta = choice.effect > 0 ? `+${choice.effect}` : `${choice.effect}`;
            showNotification(`Отношения: ${delta}`);
        }
    }

    // Добавить ответ игрока в диалог
    const playerReply = {
        char: 'narrator',
        text: `${gameState.player.name}: «${choice.text}»`
    };
    // Показать короткий ответ, потом продолжить сцену
    setCurrentSpeaker({ name: gameState.player.name, photo: '', sprite: '', relationKey: null, glowColor: '#888' });
    typeText(`${gameState.player.name}: «${choice.text}»`);
    document.getElementById('continueBtn').style.display = 'none';

    setTimeout(() => {
        if (pendingNextScene) {
            playScene(pendingNextScene);
        }
    }, choice.text.length * typeSpeed + 1000);
}

function hideChoices() {
    document.getElementById('choicesPanel').style.display = 'none';
}

// ===== ИСТОРИЧЕСКИЕ СОБЫТИЯ =====
function showHistoricalEvent(ev, callback) {
    const banner = document.getElementById('eventBanner');
    document.getElementById('eventYear').textContent = ev.year;
    document.getElementById('eventTitle').textContent = ev.title;
    document.getElementById('eventDesc').textContent = ev.desc;

    banner.style.display = 'flex';
    banner._callback = callback;

    // Обновить статус Германии
    document.getElementById('germanyStatus').textContent = '🇩🇪 ' + ev.germanyStatus;
    document.getElementById('statusMood').textContent = '🇩🇪 ' + ev.mood;

    if (ev.bgUrl) {
        document.getElementById('sceneBg').style.background = `
            linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%),
            url('${ev.bgUrl}') center/cover no-repeat`;
    }
}

function closeEvent() {
    const banner = document.getElementById('eventBanner');
    banner.style.display = 'none';
    if (banner._callback) {
        const cb = banner._callback;
        banner._callback = null;
        cb();
    }
}

// ===== ВРЕМЯ =====
function advanceTime(year, month) {
    gameState.player.year = year;
    gameState.player.month = month;
    updateDateDisplay();
}

function updateDateDisplay() {
    const months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
    const m = months[gameState.player.month] || '';
    document.getElementById('dateDisplay').textContent = `${m} ${gameState.player.year}`;
    document.getElementById('statusYear').textContent = `📅 ${gameState.player.year}`;
}

// ===== СТАТУС БАР =====
function updateStatusBar() {
    const rankNames = {
        civilian: 'Гражданин',
        journalist: 'Журналист',
        officer: 'Офицер',
        diplomat: 'Дипломат',
        politician: 'Политик',
    };
    document.getElementById('statusRank').textContent = `👤 ${rankNames[gameState.player.rank] || ''}`;
    document.getElementById('statusInfluence').textContent = `⚡ Влияние: ${gameState.player.influence}`;
}

// ===== ОТНОШЕНИЯ =====
function toggleRelations() {
    const sidebar = document.getElementById('relationsSidebar');
    if (sidebar.style.display === 'none' || !sidebar.style.display) {
        sidebar.style.display = 'block';
        updateRelationsSidebar();
    } else {
        sidebar.style.display = 'none';
    }
}

function updateRelationsSidebar() {
    const list = document.getElementById('relationsList');
    list.innerHTML = '';

    const charOrder = ['hitler', 'stalin', 'churchill', 'mussolini', 'hindenburg'];
    charOrder.forEach(id => {
        const char = CHARACTERS[id];
        if (!char || !char.relationKey) return;
        const rel = gameState.relations[id] || 50;
        const label = getRelationLabel(rel);
        const color = getRelationColor(rel);

        const item = document.createElement('div');
        item.className = 'relation-item';
        item.innerHTML = `
            <img src="${char.photo}" alt="${char.name}" class="relation-avatar" onerror="this.style.display='none'">
            <div class="relation-info">
                <div class="relation-name">${char.name}</div>
                <div class="relation-level" style="color:${color}">${label} (${rel}/100)</div>
                <div class="relation-bar">
                    <div class="relation-fill" style="width:${rel}%;background:${color}"></div>
                </div>
            </div>
        `;
        item.onclick = () => {
            toggleRelations();
            meetCharacter(id);
        };
        list.appendChild(item);
    });
}

function getRelationLabel(rel) {
    if (rel >= 95) return '💍 Глубокая любовь';
    if (rel >= 85) return '❤ Романтика';
    if (rel >= 70) return '💛 Близкие';
    if (rel >= 55) return '🤝 Дружба';
    if (rel >= 40) return '😐 Нейтральный';
    if (rel >= 25) return '😒 Напряжение';
    if (rel >= 10) return '😠 Враждебность';
    return '⚔ Ненависть';
}

function getRelationColor(rel) {
    if (rel >= 85) return '#e83e8c';
    if (rel >= 70) return '#f39c12';
    if (rel >= 50) return '#27ae60';
    if (rel >= 30) return '#7f8c8d';
    return '#c0392b';
}

// ===== ВСТРЕЧА С ПЕРСОНАЖЕМ (из панели отношений) =====
function meetCharacter(id) {
    const rel = gameState.relations[id] || 50;
    let sceneData = null;

    if (id === 'hitler') {
        let dialogueSet = 'neutral';
        if (rel >= 95) dialogueSet = 'romantic';
        else if (rel >= 85) dialogueSet = 'close';
        else if (rel >= 65) dialogueSet = 'friendly';
        else if (rel < 30) dialogueSet = 'hostile';

        const pool = HITLER_DIALOGUES[dialogueSet];
        const randomLine = pool[Math.floor(Math.random() * pool.length)];

        currentDialogues = [{ char: 'hitler', text: randomLine.text }];
        pendingChoices = rel >= 85 ? 'hitlerRomantic' : rel >= 65 ? 'hitlerChildhood' : 'hitlerPolitics';
        pendingNextScene = null;
        currentDialogueIdx = 0;
        setCurrentSpeaker(CHARACTERS.hitler);
        document.getElementById('characterSprite').src = CHARACTERS.hitler.sprite;
        document.getElementById('characterSprite').style.display = 'block';
        typeText(randomLine.text);
    } else {
        const charDialogues = {
            stalin: STALIN_DIALOGUES,
            churchill: CHURCHILL_DIALOGUES,
            mussolini: MUSSOLINI_DIALOGUES,
            hindenburg: HINDENBURG_DIALOGUES,
        };
        const dSets = charDialogues[id];
        if (dSets) {
            const setKey = rel >= 75 ? 'friendly' : rel < 30 ? 'hostile' : 'neutral';
            const pool = dSets[setKey] || dSets.neutral || [{ text: '...' }];
            const randomLine = pool[Math.floor(Math.random() * pool.length)];
            currentDialogues = [{ char: id, text: randomLine.text }];
            pendingChoices = 'generalPositive';
            pendingNextScene = null;
            currentDialogueIdx = 0;
            setCurrentSpeaker(CHARACTERS[id]);
            document.getElementById('characterSprite').src = CHARACTERS[id].sprite;
            document.getElementById('characterSprite').style.display = 'block';
            typeText(randomLine.text);
        }
    }
}

// ===== СОХРАНЕНИЕ =====
function saveGame() {
    localStorage.setItem('reichRosesSave', JSON.stringify(gameState));
    showNotification('💾 Игра сохранена');
}

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(msg) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3200);
}

// ===== КЛАВИАТУРА =====
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn.style.display !== 'none') {
            nextDialogue();
        }
    }
});

// ===== КЛИКНУТЬ НА ДИАЛОГ — ПРОПУСТИТЬ АНИМАЦИЮ =====
document.getElementById('dialogueBox')?.addEventListener('click', () => {
    if (isTyping) {
        clearInterval(typeTimer);
        const dial = currentDialogues[currentDialogueIdx];
        if (dial) document.getElementById('dialogueText').textContent = dial.text || '...';
        isTyping = false;
        document.getElementById('textCursor').style.display = 'none';
        document.getElementById('continueBtn').style.display = 'block';
    } else {
        nextDialogue();
    }
});
