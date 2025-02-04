using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
    public class LocationHub : Hub
    {
        public async Task SendLocation(string user, double latitude, double longitude)
        {
            await Clients.Others.SendAsync("ReceiveLocation", user, latitude, longitude);
        }
    }
}