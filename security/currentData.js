const dateNow = () =>
{
    const data = new Date();
    let day = data.getDate();
    let month = data.getMonth() + 1;
    let year = data.getFullYear();
    let hours = data.getHours();
    let min = data.getMinutes();
    const tab = [day, month, year, hours, min];
    return tab;
}
module.exports = dateNow;