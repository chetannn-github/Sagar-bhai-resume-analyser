document.addEventListener("DOMContentLoaded", () => {
    gsap.to(".container", { opacity: 1, y: 0, duration: 1 });
  
    const uploadBox = document.getElementById("uploadBox");
    const resumeInput = document.getElementById("resumeInput");
    const fileNameDisplay = document.getElementById("fileName");
    const uploadBtn = document.getElementById("uploadBtn");
  
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
  
    // Drag & Drop Event Listeners
    uploadBox.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadBox.style.borderColor = "#0056b3";
    });
  
    uploadBox.addEventListener("dragleave", () => {
      uploadBox.style.borderColor = "#007bff";
    });
  
    uploadBox.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadBox.style.borderColor = "#007bff";
  
      const file = e.dataTransfer.files[0];
      if (file && allowedTypes.includes(file.type)) {
        resumeInput.files = e.dataTransfer.files;
        fileNameDisplay.innerText = `Selected: ${file.name}`;
      } else {
        alert("Only PDF, DOC, and DOCX files are allowed.");
      }
    });
  
    // File Input Change Event
    resumeInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && allowedTypes.includes(file.type)) {
        fileNameDisplay.innerText = `Selected: ${file.name}`;
      } else {
        alert("Only PDF, DOC, and DOCX files are allowed.");
        resumeInput.value = ""; // Clear the input
      }
    });
  
    // Upload Button Click Event
    uploadBtn.addEventListener("click", async () => {
      const file = resumeInput.files[0];
      if (!file) {
        alert("Please select a resume to upload.");
        return;
      }
  
      const formData = new FormData();
      formData.append("resume", file);
  
      try {
        uploadBtn.innerText = "Uploading...";
        uploadBtn.disabled = true;
  
        // Set a timeout for the fetch request (prevents hanging)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
  
        const response = await fetch("http://127.0.0.1:5000/api/test", {
          method: "GET",
          
        });
  
        const json = await response.json();
        console.log(json);
  
        clearTimeout(timeoutId); // Clear timeout if request completes
  
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
  
        const data = await response.json();
  
        if (data.success) {
          // Save response in localStorage
          localStorage.setItem(
            "resumeAnalysis",
            JSON.stringify({
              score: data.score,
              strengths: data.strengths || [],
              improvements: data.improvements || [],
              suggestions: data.suggestions || [],
            })
          );
  
          alert("Resume uploaded successfully! Redirecting...");
          window.location.href = "result.html";
        } else {
          throw new Error(data.error || "Something went wrong.");
        }
      } catch (error) {
        if (error.name === "AbortError") {
          alert("Request timed out. Please try again.");
        } else {
          console.error("Upload Error:", error);
          alert(`Upload failed: ${error.message}`);
        }
      } finally {
        uploadBtn.innerText = "Upload & Analyze";
        uploadBtn.disabled = false;
      }
    });
  });
  