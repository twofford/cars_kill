// const fetchCrashes = () => {
//     return (
//         $.ajax({
//             url: "https://data.cityofnewyork.us/resource/h9gi-nx95.geojson",
//             type: "GET",
//             data: {
//                 "$$app_token": "GeazDF3xhBoHQv3NWt30dElQb",
//                 "$limit" : 5000
//             }
//         }).done(function(data) {
//             return data;
//         })
//     );
// }

const fetchCrashes = () => {
    return (
    $.ajax({
        url: "https://data.cityofnewyork.us/resource/h9gi-nx95.geojson",
        type: "GET",
        data: {
            "$$app_token": "GeazDF3xhBoHQv3NWt30dElQb",
            "$limit" : 5000
        }
    }).done((data) => {
        return data;
    })
    )
}

const fetchCrashesByYear = (year) => {

    return (
        $.ajax({
            url: `https://data.cityofnewyork.us/resource/h9gi-nx95.geojson?$where=crash_date%20between%20%22${year}-01-01T00:00:00.000%22%20and%20%22${year}-12-31T00:00:00.000%22`,
            type: "GET",
            data: {
                "$$app_token": "GeazDF3xhBoHQv3NWt30dElQb",
                "$limit": 5000
            }

        }).done(function(data) {
            return data;
        })
    );
}