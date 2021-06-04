var client_id = "ijh55o11vg5nc80rsy67puvk8m4ce6";
var redirect =
  "https://barrycarlyon.github.io/twitch_misc/authentication/implicit_auth/";

document
  .getElementById("authorize_public")
  .setAttribute(
    "href",
    "https://id.twitch.tv/oauth2/authorize?client_id=ijh55o11vg5nc80rsy67puvk8m4ce6" +
      client_id +
      "&redirect_uri=" +
      encodeURIComponent(redirect) +
      "&response_type=token"
  );
document
  .getElementById("authorize_email")
  .setAttribute(
    "href",
    "https://id.twitch.tv/oauth2/authorize?client_id=ijh55o11vg5nc80rsy67puvk8m4ce6" +
      client_id +
      "&redirect_uri=" +
      encodeURIComponent(redirect) +
      "&response_type=token&scope=user:read:email"
  );
document.getElementById("access_token").textContent = "";

if (document.location.hash && document.location.hash != "") {
  var parsedHash = new URLSearchParams(window.location.hash.substr(1));
  if (parsedHash.get("access_token")) {
    var access_token = parsedHash.get("access_token");
    document.getElementById("access_token").textContent =
      "Your Access Key from the #url: " + access_token;

    document.getElementById("user_data").textContent = "Loading";

    // call API
    fetch("https://api.twitch.tv/helix/users", {
      headers: {
        "Client-ID": client_id,
        Authorization: "Bearer " + access_token,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        document.getElementById("user_data").innerHTML =
          "<p>Your Public Twitch Profile from Helix:</p>";
        var table = document.createElement("table");
        document.getElementById("user_data").append(table);
        for (var key in resp.data[0]) {
          var tr = document.createElement("tr");
          table.append(tr);
          var td = document.createElement("td");
          td.textContent = key;
          tr.append(td);
          var td = document.createElement("td");
          td.textContent = resp.data[0][key];
          tr.append(td);
        }
      })
      .catch((err) => {
        console.log(err);
        document.getElementById("user_data").textContent =
          "Something went wrong";
      });
  }
} else if (document.location.search && document.location.search != "") {
  var parsedParams = new URLSearchParams(window.location.search);
  if (parsedParams.get("error_description")) {
    document.getElementById("access_token").textContent =
      parsedParams.get("error") + " - " + parsedParams.get("error_description");
  }
}
