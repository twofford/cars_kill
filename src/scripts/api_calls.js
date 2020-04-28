export const fetchCrahes = () => {
    return $.ajax({
        url: "https://data.cityofnewyork.us/resource/h9gi-nx95.geojson",
        type: "GET",
        data: {
            "$limit" : 5000,
            "$$app_token": "GeazDF3xhBoHQv3NWt30dElQb"
        }
    })
}