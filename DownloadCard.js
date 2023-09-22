const stdName = document.getElementById('stdName')
const stdCourse = document.getElementById('stdCourse')
const stdCardName = document.getElementById('stdCardName')
const stdFatherName = document.getElementById("father-name-input")
const stdNic = document.getElementById('stdNic')
const STDCourse = document.getElementById('STDCourse')
const stdImg = document.getElementById('stdImg')

let stdCardData = localStorage.getItem('stdCardData')
stdCardData = JSON.parse(stdCardData)
console.log(stdCardData)


stdName.innerHTML = stdCardData.fullName
stdCourse.innerHTML = stdCardData.course
stdCardName.value = stdCardData.fullName
stdFatherName.value = stdCardData.fatherName
stdNic.value = stdCardData.cnic
STDCourse.value = stdCardData.course
stdImg.src = stdCardData.image
