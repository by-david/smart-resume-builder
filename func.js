let photoDataURL = "";

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-theme");
  updateThemeButton();

  // Toggle favicon for dark/light mode
   const favicon = document.getElementById("favicon");
if (body.classList.contains("dark-theme")) {
  favicon.href = "img/dark.png";
} else {
  favicon.href = "img/light.png";
}
  
}

function updateThemeButton() {
  const themeIcon = document.getElementById("themeIcon");
  const themeToggle = document.getElementById("themeToggle");

  if (document.body.classList.contains("dark-theme")) {
    themeIcon.classList.replace("fa-moon", "fa-sun");
    themeToggle.classList.replace("btn-secondary", "btn-light");
  } else {
    themeIcon.classList.replace("fa-sun", "fa-moon");
    themeToggle.classList.replace("btn-light", "btn-secondary");
  }
}

document
  .getElementById("resumeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const summary = document.getElementById("summary").value;
    const skills = document.getElementById("skills").value.split(",");
    const experience = document.getElementById("experience").value;
    const education = document.getElementById("education").value;
    const linkedin = document.getElementById("linkedin").value;
    const github = document.getElementById("github").value;
    const photo = document.getElementById("photo").files[0];

    document.getElementById("previewName").textContent = name;
    document.getElementById("previewEmail").textContent = email;
    document.getElementById("previewSummary").textContent = summary;

    const skillsList = document.getElementById("previewSkills");
    skillsList.innerHTML = "";
    skills.forEach((skill) => {
      const li = document.createElement("li");
      li.textContent = skill.trim();
      skillsList.appendChild(li);
    });

    document.getElementById("previewExperience").textContent = experience;
    document.getElementById("previewEducation").textContent = education;
    document.getElementById("previewLinkedIn").textContent = linkedin;
    document.getElementById("previewGitHub").textContent = github;

    if (photo) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const previewPhoto = document.getElementById("previewPhoto");
        previewPhoto.src = e.target.result;
        previewPhoto.style.display = "block";
        photoDataURL = e.target.result;
      };
      reader.readAsDataURL(photo);
    }

    const qrCodeContainer = document.getElementById("qrcode");
    qrCodeContainer.innerHTML = "";
    new QRCode(qrCodeContainer, {
      text: `Name: ${name}\nEmail: ${email}\nLinkedIn: ${linkedin}\nGitHub: ${github}`,
      width: 128,
      height: 128,
    });
  });

  function allFieldsFilled() {
  // List all required field IDs
  const requiredFields = [
    "name",
    "email",
    "summary",
    "skills",
    "experience",
    "education",
    "linkedin",
    "github"
  ];
  for (const id of requiredFields) {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      return false;
    }
  }
  // Check if a photo is uploaded
  const photo = document.getElementById("photo");
  if (!photo || !photo.files || photo.files.length === 0) {
    return false;
  }
  return true;
}

function downloadPDF() {
  if (!allFieldsFilled()) {
    alert("Please fill out all fields and upload a profile photo before downloading the PDF.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;

  if (photoDataURL) {
    doc.addImage(photoDataURL, "PNG", 150, y, 40, 40);
  }

  doc.setFontSize(12);
  doc.text(
    `Name: ${document.getElementById("previewName").textContent}`,
    10,
    (y += 10)
  );
  doc.text(
    `Email: ${document.getElementById("previewEmail").textContent}`,
    10,
    (y += 10)
  );
  doc.text(
    `Summary: ${document.getElementById("previewSummary").textContent}`,
    10,
    (y += 10)
  );

  const skills = Array.from(
    document.getElementById("previewSkills").children
  ).map((li) => li.textContent);
  doc.text(`Skills: ${skills.join(", ")}`, 10, (y += 10));
  doc.text(
    `Experience: ${
      document.getElementById("previewExperience").textContent
    }`,
    10,
    (y += 10)
  );
  doc.text(
    `Education: ${
      document.getElementById("previewEducation").textContent
    }`,
    10,
    (y += 10)
  );
  doc.text(
    `LinkedIn: ${document.getElementById("previewLinkedIn").textContent}`,
    10,
    (y += 10)
  );
  doc.text(
    `GitHub: ${document.getElementById("previewGitHub").textContent}`,
    10,
    (y += 10)
  );

  doc.save("resume.pdf");
}

async function downloadWord() {
  const { Document, Packer, Paragraph, TextRun } = window.docx;

  const name = document.getElementById("previewName").textContent;
  const email = document.getElementById("previewEmail").textContent;
  const summary = document.getElementById("previewSummary").textContent;
  const skills = Array.from(
    document.getElementById("previewSkills").children
  ).map((li) => li.textContent);
  const experience = document.getElementById("previewExperience").textContent;
  const education = document.getElementById("previewEducation").textContent;
  const linkedin = document.getElementById("previewLinkedIn").textContent;
  const github = document.getElementById("previewGitHub").textContent;

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Resume", bold: true, size: 32 })],
            spacing: { after: 400 },
          }),
          new Paragraph(`Name: ${name}`),
          new Paragraph(`Email: ${email}`),
          new Paragraph(`Summary: ${summary}`),
          new Paragraph(`Skills: ${skills.join(", ")}`),
          new Paragraph(`Experience: ${experience}`),
          new Paragraph(`Education: ${education}`),
          new Paragraph(`LinkedIn: ${linkedin}`),
          new Paragraph(`GitHub: ${github}`),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.docx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}