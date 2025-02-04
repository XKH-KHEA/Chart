using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class VideoHub : Hub
{
    public async Task SendOffer(string offer)
    {
        await Clients.Others.SendAsync("ReceiveOffer", offer);
    }

    public async Task SendAnswer(string answer)
    {
        await Clients.Others.SendAsync("ReceiveAnswer", answer);
    }

    public async Task SendCandidate(string candidate)
    {
        await Clients.Others.SendAsync("ReceiveCandidate", candidate);
    }
}
