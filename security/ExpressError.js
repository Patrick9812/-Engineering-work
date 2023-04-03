class ExpressError extends Error
{
    construktor(message, status)
    {
        this.message = message;
        this.status = status;
    }
}
module.exports = ExpressError;