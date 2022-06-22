const urlInput = document.getElementById("urlInput");
const outputBox = document.querySelector(".output__box");
const loadingBox = document.querySelector(".loading__box");
const poster = document.getElementById("poster");
const title = document.getElementById("title");
const downloadLink = document.getElementById("downloadLink");

urlInput.addEventListener("change", async () => {
  const urlInputVal = urlInput.value;
  const regex =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gi;
  const isValid = regex.test(urlInputVal);

  if (isValid) {
    try {
      outputBox.style = "display:none";
      loadingBox.querySelector("h3").textContent = "Fetching data...";
      loadingBox.style = "display:flex";
      const videoId = urlInputVal.split("v=")[1];
      const res = await fetch(
        `https://rimonians-ytdl-mp3.herokuapp.com/info/${videoId}`
      );
      const data = await res.json();
      const thumbnail = data.thumbnails[data.thumbnails.length - 1].url;
      poster.src = thumbnail;
      title.textContent = data.title;
      outputBox.style = "display:flex";
      loadingBox.style = "display:none";
      downloadLink.href = `/download/${videoId}`;
    } catch (err) {
      loadingBox.querySelector("h3").textContent = err.message;
    }
  } else {
    alert("Please provide valid url");
  }
});
