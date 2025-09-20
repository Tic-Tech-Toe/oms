export const useCurrency = function(num:any) {
    const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
    }).format(num);

    return formatted.replace("₹", "₹ ");
};
