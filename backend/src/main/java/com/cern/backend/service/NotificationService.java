package com.cern.backend.service;

import com.cern.backend.entity.Emergency;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyNewEmergency(Emergency emergency) {
        messagingTemplate.convertAndSend(
                "/topic/emergencies",
                emergency
        );
    }
}