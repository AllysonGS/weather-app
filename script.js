const apiKey = "SUA_API_KEY_AQUI"; // só para seu site

// Alternância de tema
document.getElementById("toggleTheme").addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    document.getElementById("toggleTheme").textContent =
        isDark ? "☀️ Tema claro" : "🌙 Tema escuro";
});

// Autocomplete
document.getElementById("cityInput").addEventListener("input", async (e) => {
    const input = e.target.value.trim();
    const list = document.getElementById("autocompleteList");

    if (input.length < 2) {
        list.style.display = "none";
        return;
    }

    const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKey}`
    );

    const cities = await response.json();

    list.innerHTML = "";
    list.style.display = "block";

    cities.forEach(city => {
        const item = document.createElement("div");
        item.classList.add("autocomplete-item");

        item.textContent = `${city.name}, ${city.country}`;
        item.addEventListener("click", () => {
            document.getElementById("cityInput").value = city.name;
            list.style.display = "none";
            getWeather(city.name);
            getForecast(city.name);
        });

        list.appendChild(item);
    });
});

// Botão buscar
document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value.trim();
    if (city !== "") {
        getWeather(city);
        getForecast(city);
    }
});

// Busca clima atual
async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
        );

        if (!response.ok) throw new Error("Cidade não encontrada");

        const data = await response.json();

        const weatherIconUrl =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        document.getElementById("cityName").textContent =
            `${data.name} (${data.sys.country})`;
        document.getElementById("weatherDesc").textContent =
            data.weather[0].description;
        document.getElementById("temperature").textContent =
            `${data.main.temp}°C`;
        document.getElementById("humidity").textContent =
            `${data.main.humidity}%`;
        document.getElementById("mainWeather").textContent =
            data.weather[0].main;

        document.getElementById("weatherIcon").src = weatherIconUrl;

        document.getElementById("weatherInfo").classList.remove("hidden");

    } catch (error) {
        alert(error.message);
    }
}

// Busca previsão 5 dias
async function getForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
        );

        if (!response.ok) throw new Error("Erro ao carregar previsão");

        const data = await response.json();

        const forecastDiv = document.getElementById("forecastContainer");
        forecastDiv.innerHTML = "";

        const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        dailyData.forEach(day => {
            const card = document.createElement("div");
            card.classList.add("forecast-card", "fade-in");

            const date = new Date(day.dt * 1000).toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "numeric",
                month: "numeric"
            });

            card.innerHTML = `
                <h4>${date}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <p>${day.weather[0].description}</p>
                <p><strong>${day.main.temp}°C</strong></p>
            `;

            forecastDiv.appendChild(card);
        });

        document.getElementById("nextDaysTitle").classList.remove("hidden");
        forecastDiv.classList.remove("hidden");

    } catch (error) {
        alert(error.message);
    }
}
