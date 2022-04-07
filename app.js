Array.prototype.randomValue = function () {
    return this[Math.floor(Math.random() * this.length)];
}// функция для массива для создания рандомного значения из массива
let rightAnswer, userAnswer;
let final = {
    time: 0,
    cof: 0,
}

// Переменные для финального ответа
let finalObj = {}

// переменные для контроля времени
let finalTimerInterval;
let finalTime = 0
let forOneTaskTimer;
let timeForOneTask = 0
let timeForOneTaskArr = []

function start(min, max) {
    let calculator = $('.calculator')
    let calculatorRes = $(".calculator__res")
    let currentNumber = ''
    // Генирация цифр с 0 до 9
    for (let i = 0; i < 10; i++) {
        let div = document.createElement('div')
        div.classList.add('calculator__item')
        div.innerHTML = i

        calculator.append(div)
    }

    // Добавление события на каждую цифру
    let calculatorItems = $('.calculator__item')

    for (let i = 0; i < calculatorItems.length; i++) {
        $(calculatorItems[i]).on('click', function () {
            currentNumber = $(calculatorRes).text()
            currentNumber += $(this).text()

            calculatorRes.html(currentNumber)
        })
    }

    // Очищение результата полностью
    let clear = $('.calculator__clear')

    clear.on('click', function () {
        $(calculatorRes).html('')
        currentNumber = ''
    })

    // Удаление цифр по одному с конца

    let deleteNumber = $('.calculator__delete')
    deleteNumber.on('click', function () {
        let html = $(calculatorRes).html().substring(0, calculatorRes.html().length - 1)
        currentNumber = html

        $(calculatorRes).html(currentNumber)
    })

    let distance = Math.ceil((max - min) / 5) // Дистанция между диапазонами
    let prevMin = min // Предыдуший минимум диапазона

    let rangeArr = [];// Массив со всеми диапазонами [[0,20],[20,40],[40,60],[60,80],[80,100]]
    let rangeQueue = 0 // очередь диапазона индекс в массиве rangeArr ( rangeArr[rangeQueue])
    let inRangeQuestion = 0 // номер задания в диапазон от 1 до 5
    for (let i = 0; i < 5; i++) { // заполнение массива rangeArr
        rangeArr [i] = [prevMin, prevMin + distance] //[минимум в диапазон,минимум в диапазоне + дистанция]
        // Финальный объект
        finalObj[rangeArr [i]] = []

        prevMin += distance //Обновление предыдущего минимума (дабвление дистанции)
    }

    newTask(rangeArr, rangeQueue)

    // Добавление события на кнопку NEXT

    $("#calculator__next").click(function () {
        let right = 0
        let userAnswerCalc = 0
        userAnswer = currentNumber
        // Проверка если ответы пользователя совпадают с правильным ответом то true
        if (rightAnswer == +userAnswer) {
            right++
            userAnswerCalc++
            console.log(true)
        }

        finalObj[rangeArr[rangeQueue]].push({time: timeForOneTask, right: right})

        console.log(finalObj)


        // Проверка сколько времени ушло у пользователя что бы решить одну задачу
        if (inRangeQuestion++ || inRangeQuestion === 1) {
            // Есть массив в который пишится время каждой (одной) задачи
            timeForOneTaskArr.push(timeForOneTask)
            // после того как запушили значение обнуляем счетчик для подсчета одного примера
            timeForOneTask = 0
        }
        localStorage.setItem('TimeForOneTaskArr', JSON.stringify(timeForOneTaskArr)) // Сохраняем наш массив в localeStorage

        if (inRangeQuestion === 5) {
            inRangeQuestion = 0
            rangeQueue++
            console.log(rangeArr[rangeQueue])
        }

        // Проверяем если человек сделал все 25 примеров то в объекте final в ключе final.time записываем финальное время решения то есть за сколько всего он сделал 25 примеров
        if (timeForOneTaskArr.length == 25) {
            final.time = finalTime
            // после чего останавливаем таймер
            clearInterval(timerInterval)
            // и сохраняем его в localeStorage
            localStorage.setItem('FinalObj', JSON.stringify(final))
        }

        currentNumber = ''
        $(calculatorRes).html('')
        newTask(rangeArr, rangeQueue)

        if (localStorage.getItem('ArrWithAnswer')) {
            let allTasks = JSON.parse(localStorage.getItem('ArrWithAnswer'))

            console.log(allTasks)

            allTasks[rangeArr[rangeQueue]].push({time: timeForOneTask, right: right})
            // finalObj[rangeArr[rangeQueue]].push({time: timeForOneTask, right: right})

            localStorage.setItem('ArrWithAnswer', JSON.stringify(allTasks))
        }

        console.log()

        localStorage.setItem('ArrWithAnswer', JSON.stringify(finalObj))
    })

    function newTask(rangeArr, rangeQueue) {
        let sign = ["+", "-"] //Знаки используемые в задании
        let firstNumber; // Первая цифра для постановки в блок
        let secondNumber // Вторая цифра для постановки в блок
        let currentSign = sign.randomValue() // Выбор случайного знака для примера
        let currentRange = rangeArr[rangeQueue] //Нынешний диапазон

        if (currentSign === "+") { // если знак равен "+" тогда это
            do {
                firstNumber = randomNumber(currentRange[0], currentRange[1]) // Первое число из диапазоне
                secondNumber = randomNumber(currentRange[0], currentRange[1] - firstNumber) // второе число берется в диапазон от минимума и максимум - первое число ( нужно чтобы сумма двух цифр не была больше максимума в диапазоне)
            } while (firstNumber + secondNumber > currentRange[1])

            rightAnswer = firstNumber + secondNumber
        } else { // если знак равен "-" тогда это
            firstNumber = randomNumber(currentRange[0], currentRange[1])// Первое число из диапазоне
            secondNumber = randomNumber(currentRange[0], firstNumber) // при решении задачи  резултат не должен быть отрицательным для это второе число должно быть в диапазоне от минимума до первого числа

            rightAnswer = firstNumber - secondNumber
        }
        $(".calculator__first").html(firstNumber)
        $(".calculatior__sign").html(currentSign)
        $(".calculator__second").html(secondNumber)
    }
}

start(0, 100)

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
} //функция для создания рандомног очисла в диапазоне

timerInterval = setInterval(function () {
    finalTime++
}, 1000)

// Запуск таймера на одну задачу
forOneTaskTimer = setInterval(() => {
    timeForOneTask++
}, 1000)
