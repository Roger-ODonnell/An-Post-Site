document.addEventListener("DOMContentLoaded", function () {
    const newsCarousel = document.getElementById("newsCarousel");
    const nextButton = document.getElementById("nextButton");

    // Fetch news data from News API
    fetchNewsData();

    // Update the carousel every half hour
    setInterval(fetchNewsData, 1800000);

    // Add event listener to the "Next" button
    nextButton.addEventListener("click", function () {
        cycleNext();
    });
});

async function fetchNewsData() {
    const newsCarousel = document.getElementById("newsCarousel");

    // Clear existing news items
    newsCarousel.innerHTML = "";

    try {
        // Replace 'YOUR_API_KEY' with your actual News API key
        const apiKey = '3f5278293879447991e289e39b692555';
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=ie&apiKey=${apiKey}`);
        const data = await response.json();

        // Process the data and add news items to the carousel
        data.articles.forEach((article) => {
            const newsElement = createNewsElement(article);
            newsCarousel.appendChild(newsElement);
        });
    } catch (error) {
        console.error("Error fetching news data:", error);
    }

    // Display the first three items initially
    showCurrentItems();
}

function createNewsElement(article) {
    const newsElement = document.createElement("div");
    newsElement.classList.add("news-item");

    // Check if article.urlToImage is not null and not an empty string
    const imageUrl = article.urlToImage ? `https://images.weserv.nl/?url=${encodeURIComponent(article.urlToImage)}` : '/Images/Placeholder.png';

    console.log('Image URL:', imageUrl); // Log the image URL

    const imgElement = document.createElement("img");
    imgElement.alt = article.title;
    imgElement.onload = function () {
        console.log('Image loaded successfully');
    };
    imgElement.onerror = function () {
        handleImageError(this);
    };

    // Set inline styles for width and height
    imgElement.style.width = '160px';
    imgElement.style.height = '150px'; // Adjust the height as needed

    imgElement.src = imageUrl; // Set the image source
    newsElement.appendChild(imgElement);

    const titleElement = document.createElement("h3");
    titleElement.textContent = article.title;
    newsElement.appendChild(titleElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = article.description || ''; // Use an empty string if description is null
    newsElement.appendChild(descriptionElement);

    const readMoreLink = document.createElement("a");
    readMoreLink.href = article.url;
    readMoreLink.target = "_blank";
    readMoreLink.textContent = "Read more";
    readMoreLink.style.color = "7566ab"
    readMoreLink.style.textDecoration = "none"
    newsElement.appendChild(readMoreLink);

    return newsElement;
}


function handleImageError(imgElement) {
    // Check if a placeholder image is already set to avoid an infinite loop
    if (!imgElement.getAttribute('data-laceholder-set')) {
        // Set a placeholder image or a default image URL
        imgElement.src = '/Images/Placeholder.png';
        imgElement.setAttribute('data-placeholder-set', 'true');
        console.error('Error loading image. Placeholder set.', imgElement.alt);
    }
}


function showCurrentItems() {
    const newsCarousel = document.getElementById("newsCarousel");
    const items = newsCarousel.getElementsByClassName("news-item");

    // Hide all items
    Array.from(items).forEach((item) => {
        item.style.display = "none";
    });

    // Display the first three items
    for (let i = 0; i < 5; i++) {
        if (items[i]) {
            items[i].style.display = "block";
        }
    }
}

function cycleNext() {
    const newsCarousel = document.getElementById("newsCarousel");
    const items = newsCarousel.getElementsByClassName("news-item");

    // Move the first item to the end
    newsCarousel.appendChild(items[0].cloneNode(true));
    newsCarousel.removeChild(items[0]);

    // Update visibility
    showCurrentItems();
}

document.addEventListener("DOMContentLoaded", function () {
    // Your existing code...
  
    // Run the cycleNext function every two hours (2 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    setInterval(cycleNext, 2 * 60 * 60 * 1000);
  });
  

document.addEventListener("DOMContentLoaded", function () {
    const newsCarousel = document.getElementById("newsCarousel");
  
    if (newsCarousel) {
      newsCarousel.style.marginTop = "5em";
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    function displayGreeting() {
      console.log("Checking time...");
  
      const now = new Date();
      console.log("Current time:", now);
  
      const currentHour = now.getHours();
      console.log("Current hour:", currentHour);
  
      const greetingElement = document.getElementById("greetingMessage");
  
      if (greetingElement) {
        if (currentHour >= 6 && currentHour < 12) {
          greetingElement.textContent = "Good Morning!";
        } else if (currentHour >= 14 && currentHour < 18) {
          greetingElement.textContent = "Good Afternoon!";
        } else {
          greetingElement.textContent = "Good Evening!";
        }
      } else {
        console.error("Element with id 'greetingMessage' not found");
      }
    }
  
    displayGreeting();
    setInterval(displayGreeting, 60000);
  });
//End of greeting

document.addEventListener("DOMContentLoaded", function () {
    const apiKey = '728d8fabff7d2e10b49a6b3e9e252f6f';
    const weatherWidget = document.getElementById("weatherWidget");
    const refreshButton = document.getElementById("refreshButton");

    async function fetchWeatherData() {
        const latitude = '52.64041249588352';
        const longitude = '-9.48782571289275';

        try {
            const response = await fetch(`http://api.weatherstack.com/current?access_key=${apiKey}&query=${latitude},${longitude}&units=m`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (!data.current || !data.current.temperature || !data.current.weather_descriptions || !data.current.weather_icons) {
                throw new Error('Invalid data structure in the API response');
            }

            const temperature = data.current.temperature;
            const description = data.current.weather_descriptions[0];
            const weatherIconUrl = data.current.weather_icons[0];

            const weatherHTML = `
                <h2>Current Weather In Kilrush</h2>
                <p>Temperature: ${temperature}°C</p>
                <p>Current Weather: ${description}</p>
                <img src="${weatherIconUrl}" alt="Weather Icon">
            `;

            weatherWidget.innerHTML = weatherHTML;
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    // Fetch weather data initially
    fetchWeatherData();

    // Event listener for the refresh button
    refreshButton.addEventListener("click", function () {
        // Manually refresh weather data when the button is clicked
        fetchWeatherData();
    });

    // Schedule automatic refresh every 3 hours between 9am and 8pm
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 9 && currentHour < 20) {
        setInterval(fetchWeatherData, 3 * 60 * 60 * 1000); // 3 hours in milliseconds
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const messageBoard = document.getElementById("messageBoard");

    // Fetch messages from the text file
    fetch('/message.txt')
        .then(response => response.text())
        .then(messages => {
            // Split the messages into an array
            const messageArray = messages.split('\n');

            // Update the message board
            updateMessageBoard(messageArray);
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
        });

    // Fetch weather data initially
    fetchWeatherData();

    // Event listener for the refresh button
    refreshButton.addEventListener("click", function () {
        // Manually refresh weather data when the button is clicked
        fetchWeatherData();
    });
});

function updateMessageBoard(messages) {
    const messageBoard = document.getElementById("messageBoard");

    // Clear existing messages
    messageBoard.innerHTML = "";

    // Add each message to the message board
    messages.forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("manager-message");
        messageElement.textContent = message;
        messageBoard.appendChild(messageElement);
    });
}