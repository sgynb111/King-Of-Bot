package com.kob.botrunningsystem.service.impl.utils;


import com.kob.botrunningsystem.utils.BotInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.UUID;

@Component
public class Consumer extends Thread {
    private Bot bot;
    private static RestTemplate restTemplate;
    private final static String receiveBotMoveUrl = "http://127.0.0.1:3000/pk/receive/bot/move/";

    @Autowired
    public void setRestTemplate(RestTemplate restTemplate) {
        Consumer.restTemplate = restTemplate;
    }

    public void startTimeout(long timeout, Bot bot) {
        this.bot = bot;
        this.start();

        try {
            this.join(timeout);  // 最多等待timeout秒
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            this.interrupt();  // 终端当前线程
        }
    }

    private String addUid(String code, String uid) {  // 在code中的Bot类名后添加uid
        int k = code.indexOf(" implements com.kob.botrunningsystem.utils.BotInterface");
        return code.substring(0, k) + uid + code.substring(k);
    }

    @Override
    public void run() {
        UUID uuid = UUID.randomUUID();
        String uid = uuid.toString().substring(0, 8);
        String code = addUid(bot.getBotCode(), uid);
        //创建这个类
        createFile("Bot" + uid, code);
        try {
            BotInterface botInterface = CompilerUtil.generateClass("Bot" + uid, "com.kob.botrunningsystem.utils", code);
            Integer direction = botInterface.nextMove(bot.getInput());
            MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
            data.add("direction", direction.toString());
            data.add("user_id", bot.getUserId().toString());


            deleteFile("Bot" + uid);
            restTemplate.postForObject(receiveBotMoveUrl, data, String.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private void deleteFile(String name) {
        // 这个路径是自己写的，自己定义即可
        File file = new File("F:\\KOB\\backendcloud\\botrunningsystem/src/main/java/com/kob/botrunningsystem/utils/" + name + ".java");
        if (file.exists()) {
            System.out.println("----");
            file.delete();
        }
    }

    private void createFile(String name, String code) {
        try (FileWriter file = new FileWriter("F:\\KOB\\backendcloud\\botrunningsystem/src/main/java/com/kob/botrunningsystem/utils/" + name + ".java");) {
            file.write(code);
            file.flush();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
