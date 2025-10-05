function setLoading(isLoading) {
  const btnSpan = document.getElementById("btn-text");
  if (btnSpan) {
    btnSpan.innerHTML = isLoading ? "Gerando Background..." : "Gerar Background Mágico";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form-group");
  const textArea = document.getElementById("description");
  const htmlCode = document.getElementById("html-code");
  const cssCode = document.getElementById("css-code");
  const preview = document.getElementById("preview-section");

  if (!form || !textArea || !htmlCode || !cssCode || !preview) {
    console.error("Erro: elementos HTML não encontrados.");
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const description = textArea.value.trim();
    if (!description) {
      alert("Por favor, descreva o fundo desejado.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://robertodias123.app.n8n.cloud/webhook/gerador-fundo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();
      console.log("Resposta da API:", data);

      htmlCode.textContent = data.code || "Sem código HTML retornado.";
      cssCode.textContent = data.style || "Sem código CSS retornado.";

      preview.innerHTML = data.code || "";
      preview.style.display = "block";

      let styleTag = document.getElementById("dynamic-style");
      if (styleTag) styleTag.remove();

      if (data.style) {
        styleTag = document.createElement("style");
        styleTag.id = "dynamic-style";
        styleTag.textContent = data.style;
        document.head.appendChild(styleTag);
      }
    } catch (error) {
      console.error("Erro ao gerar o fundo:", error);
      htmlCode.textContent = "Não consegui gerar o código HTML, tente novamente.";
      cssCode.textContent = "Não consegui gerar o código CSS, tente novamente.";
      preview.innerHTML = "";
    } finally {
      setLoading(false);
    }
  });
});
