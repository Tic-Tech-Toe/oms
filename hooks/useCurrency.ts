
export const useCurrency = function(num:{num:any}){
    return (new Intl.NumberFormat("en-IN",{
        style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
    }).format(num))
}

// new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     minimumFractionDigits: 2
// }).format(allOrders.reduce((sum, order) => sum + order.totalAmount, 0))