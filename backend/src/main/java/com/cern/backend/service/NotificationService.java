package com.cern.backend.service;

import com.cern.backend.entity.Emergency;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyEmergencyChanged(Emergency emergency) {

    messagingTemplate.convertAndSend(
            "/topic/admin",
            emergency
    );

    switch (emergency.getCategory()) {

        case MEDICAL:
        case ROAD_ACCIDENT:
            messagingTemplate.convertAndSend(
                    "/topic/medical",
                    emergency
            );
            break;

        case FIRE:
            messagingTemplate.convertAndSend(
                    "/topic/fire",
                    emergency
            );
            break;

        case WOMEN_SAFETY:
        case CRIME:
            messagingTemplate.convertAndSend(
                    "/topic/police",
                    emergency
            );
            break;

        case GENERAL_HELP:
        case NATURAL_DISASTER:
            messagingTemplate.convertAndSend(
                    "/topic/community",
                    emergency
            );
            break;
    }
}
}