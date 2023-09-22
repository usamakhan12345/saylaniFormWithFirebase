import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
   query, where ,  getDocs , getDoc , doc
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-cTxlFBrFylN-pBhiU6AqF2G28ZXkRB0",
  authDomain: "form-d3cbe.firebaseapp.com",
  projectId: "form-d3cbe",
  storageBucket: "form-d3cbe.appspot.com",
  messagingSenderId: "191835058931",
  appId: "1:191835058931:web:9646ef932eb37965bcbd86",
  measurementId: "G-B13VYH5FMG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

let submitBtn = document.getElementById("submitBtn");
const uploadpicInput = document.getElementById("uploadpicInput");
const uploadText = document.getElementById("uploadText");
const loader = document.getElementById('loader')
const newAppBtn = document.getElementById('btn1')
const cnicNum = document.getElementById('cnicNum')
const courseList = document.getElementById("courseList")
const btn3 = document.getElementById("btn3")
const idcardBtn = document.getElementById('idcardBtn')







btn3 && btn3.addEventListener('click',()=>{
  console.log("hello")
})

const findCardPage = document.getElementById("findCardPage")

findCardPage && findCardPage.addEventListener("click",()=>{
  window.location.href = '/idCard.html'
})


newAppBtn && newAppBtn.addEventListener("click",()=>{
  window.location.href = '/index.html'
})




let stdidCardData  

const downloadIdCard = async(id)=>{
  console.log(id)
  
  const docRef = doc(db, "students", id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());

    localStorage.setItem('stdCardData',JSON.stringify( docSnap.data()))
    // generatePDF(docSnap.data());
    window.location.href = '/DownloadCard.html'

  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }

}
console.log(stdidCardData)

uploadText && uploadText.addEventListener("click", () => {
  console.log("click");
  uploadpicInput.click();
});

let profilePic = document.getElementById("profilePic");
let file;
uploadpicInput && uploadpicInput.addEventListener("change", (e) => {
  let imgUrl = URL.createObjectURL(e.target.files[0]);
  if(e.target.files[0]){

    file = e.target.files[0];
  }
  profilePic.src = imgUrl;
});
let imagedwnUrl;



submitBtn && submitBtn.addEventListener("click", async () => {
  // console.log(file.name);
  console.log("function is running");

  let city = document.getElementById("Select-City").value
  let course = document.getElementById("Select-Course").value
  let fullName = document.getElementById("fullName").value;
  let fatherName = document.getElementById("fatherName").value;
  let Emal = document.getElementById("Emal").value;
  let phone = document.getElementById("phone").value;
  let cnic = document.getElementById("cnic").value;
  let fatherCnic = document.getElementById("fatherCnic").value;
  let address = document.getElementById("address").value;
  let dateOfBirth = document.getElementById("dateOfBirth").value;
  let gender = document.getElementById("gender").value;
  let qualification = document.getElementById("qualification").value;
  let profilePic = document.getElementById("profilePic");
  let imageDiv = document.getElementById("imageDiv");

  if(city &&  course && fullName && fatherName && Emal && cnic && fatherCnic && address && dateOfBirth && gender && qualification) {
  loader.style.display = "block";

  const storageRef = ref(storage, `images/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  // console.log(fatherName.value)
  

  let studentData = {
    city: city,
    course: course,
    fullName: fullName,
    fatherName: fatherName,
    Emal: Emal,
    phone: phone,
    cnic: cnic,
    fatherCnic: fatherCnic,
    address: address,
    dateOfBirth: dateOfBirth,
    gender: gender,
    qualification: qualification,
  };
  console.log(studentData)
    // Add a new document with a generated id.
    
    /// for profile picture storage

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      console.log("error=>", error);
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        await console.log("File available at", downloadURL);
        imagedwnUrl = downloadURL;
        if (imagedwnUrl) {
          try {
            const docRef = await addDoc(collection(db, "students"), {
              ...studentData,
              image: imagedwnUrl,
            });
            console.log("Document written with ID: ", docRef.id);
            loader.style.display = "none" ;
       
          } catch (error) {
            console.log(error);
            loader.style.display = "none" ;

          }
        }
      });
    }
    );
  }
  else{
    alert("all filed are required !")
  }
});




idcardBtn && idcardBtn.addEventListener("click",async()=>{
  console.log(cnicNum.value)
  try{
    if(cnicNum.value){
       loader.style.display = "block";
      
      
      const q = query(collection(db, "students"), where("cnic", "==",cnicNum.value ));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc)
        if(doc.data()){
          courseList.innerHTML +=
          `
          <ul>
          <li>${doc.data().course}</li>
        <li id="action"><button onClick="downloadIdCard('${doc.id}')" class="btn btn-primary text-light">Download</button></li>
        </ul> 
        `
        cnicNum.value = ""
      }else{
        alert("no card available")
        cnicNum.value = ""

        
      }
      // console.log(doc.id, " => ", doc.data().course);
      loader.style.display = "none" ;

    });
     

    
  }else{
    console.log("please enter cnic num  provuded")
    alert("please enter cnic num  provuded")
    Swal.fire({
      title: 'Error!',
      text: 'Do you want to continue',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
  }
  }
  catch(er){
    console.log(er)
  }
})




window.downloadIdCard = downloadIdCard;