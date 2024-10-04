console.log('video script added');


function getTimeString(time){
    const hour = parseInt(time/3600);
    let remainingSecond = time%3600;
    const minute = parseInt(remainingSecond/60);
    remainingSecond = remainingSecond%60;
    return `${hour} hour ${minute} minute ${remainingSecond} seconds ago`;
}


const removeActiveClass =() => {
    const buttons = document.getElementsByClassName("category-btn");
    console.log(buttons);
    for(let btn of buttons){
        btn.classList.remove("active");
    //     activeBtn.style.backgroundColor= 'white';
    //     activeBtn.style.color='black';
    // }
}
}
   



const loadCategories =() => {
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then( res => res.json())
    .then(data => displayCategories(data.categories))
    .catch(error => console.log(error));
    
};

const loadVideos = (searchText="") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then( res => res.json())
    .then(data => displayVideos(data.videos))
    .catch(error => console.log(error));
    
}


const loadCategoryVideos = (id) =>{
    // alert(id);
     fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then( res => res.json())
    .then(data => {
        removeActiveClass();
        const activeBtn = document.getElementById(`btn-${id}`);
        activeBtn.classList.add("active");
        // activeBtn.style.backgroundColor= 'red';
        // activeBtn.style.color='white';
        displayVideos(data.category);
    })
    .catch(error => console.log(error));
}


const loadDetails = async(videoId) => {
    console.log(videoId);
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(uri);
    const data = await res.json();
    // console.log(data);
    displayDetails(data.video);

}
const displayDetails = (video) => {
    // console.log(video);
const detailContainer = document.getElementById("modal-content");
document.getElementById("my_modal_5").showModal();
detailContainer.innerHTML=`
<img src=${video.thumbnail}/>
<p>${video.description}
</p>
`;

}
function displayCategories(categories) {
    const categoryContainer = document.getElementById("categories");
    categories.forEach((item) => {
        // console.log(item);

        const buttonContainer = document.createElement("div");
        buttonContainer.innerHTML = `
    <button id="btn-${item.category_id}" onclick="loadCategoryVideos('${item.category_id}')" class="btn category-btn">
    ${item.category}</button>
    `;

        categoryContainer.append(buttonContainer);

    });

}




const displayVideos = (videos)=>{
const videoContainer = document.getElementById("videos");
videoContainer.innerHTML="";

if(videos.length === 0){
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML =`
    <div class="flex flex-col gap-5 justify-center items-center">
    <img src="assets/Icon.png"/>
    <h2 class="text-center text-xl font-bold">No content here in this category
    </h2>
   
    </div>
    `;
    return;
} else{
    videoContainer.classList.add("grid");
}

videos.forEach((video) => {
    // console.log(video);
    const card = document.createElement("div");
    card.classList= "card card-compact";
    card.innerHTML =`
     <figure class="h-[200px] relative">
    <img class="w-full h-full object-cover"
      src=${video.thumbnail}
      alt="Shoes" />
${
    video.others.posted_date?.length === 0 ? "" : `      <span class="absolute right-2  bottom-2 text-xs bg-black text-white rounded-lg">${getTimeString(video.others.posted_date)}</span>`
}


  </figure>
  <div class="px-0 py-2 flex  gap-2">
   <div>
   <img class="w-10 h-10 rounded-full object-cover" src =${video.authors[0].profile_picture}/>
   </div>
   <div>
   <h2 class="font-bold">${video.title}</h2>
   <div class="flex items-center">
   <p class="text-gray-400">${video.authors[0].profile_name}</p>
   ${video.authors[0].verified === true ? '<img class="w-5" src="https://img.icons8.com/?size=100&id=102698&format=png&color=000000">' : ""}
   </div>
   <p> <button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error">Details</p>
   </div>
   
   
   
  </div>
    `;
    videoContainer.append(card);
});

}

document.getElementById("search-input").addEventListener("keyup",(e)=>{
    loadVideos(e.target.value);
})
loadCategories();
loadVideos();