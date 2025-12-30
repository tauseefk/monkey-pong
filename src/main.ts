import "./style.css";

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
	throw new Error("No root to bind");
}

root.innerHTML = `
  <div>
    <div class="card">
      <button id="counter" type="button">Potato</button>
    </div>
  </div>
`;
