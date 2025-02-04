using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{


    public class NotificationHub : Hub
    {
        // Send message to all clients
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        // Send message to a specific user
        public async Task SendMessageToUser(string user, string message)
        {
            await Clients.User(user).SendAsync("ReceiveMessage", user, message);
        }
    }

}