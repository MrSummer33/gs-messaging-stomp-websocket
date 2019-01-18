package hello;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class GreetingController {


    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay
//        throw new RuntimeException("nihao aaa");
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }

    @MessageMapping("/hello/{hello}")
    @SendTo("/topic/greetings")
    public Greeting greetingDot(@DestinationVariable(value = "hello") String green) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new Greeting("Hello, " + green + "!");
    }


    @SubscribeMapping("/hello_subscription")
    public Greeting greetingSubscription() throws Exception {
        return new Greeting("Hello, !");
    }

//    @MessageMapping("/hello1")
//    public void hello(HelloMessage message) {
//
//        messagingTemplate
//                .convertAndSendToUser("user", "/topic/1/message", new Greeting("hello " + message.getName()));
//
//    }


    @MessageMapping("/hello1")
    public void hello(HelloMessage message) {
        messagingTemplate
                .convertAndSendToUser("user", "/topic/" + message.getToUser() + "/message",
                        new Greeting("hello " + message.getName()));

    }


//    @MessageExceptionHandler
//    public Greeting handlerException(Exception e) {
//        e.printStackTrace();
//        messagingTemplate.convertAndSend("/topic/greetings",new Greeting("Hello, error!"));
//        return new Greeting("Hello, error!");
//    }


}
