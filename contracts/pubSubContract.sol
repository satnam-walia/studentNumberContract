//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0; 

contract PubSubContract {
    // Define the structure of a topic
    struct Topic {
        string name;
        string[] messages;
        address[] publishers;
        address[] subscribers;
        mapping(address => string[]) subscriberToMessage;
        mapping(address => uint) subscriberToBalance;
    }

    // Mapping from topic name to Topic structure
    mapping(string => Topic) public topics;

    // Event to be emitted when a message is received
    event MessageReceived(string topic, string message, address indexed subscriber);

    // Allow publishers to advertise a topic
    function advertise(string memory topicName) public {
        Topic storage t = topics[topicName];
        t.name = topicName;
        t.publishers.push(msg.sender);
    }

    // Check if subscribers can afford the message fee
    function canSubscribersAffordIt(string memory topicName) private view returns (bool){
        Topic storage t = topics[topicName];
        for (uint i = 0; i < t.subscribers.length; i++) {
            address subscriber = t.subscribers[i];
            if(t.subscriberToBalance[subscriber] < 0.005 ether){
                return false;
            }
        }
        return true;
    }

    // Allow publishers to publish a message to a topic
    function publish(string memory topicName, string memory message) public {
        require(isPublisher(msg.sender, topicName), "Only publishers can publish messages");
        require(canSubscribersAffordIt(topicName), "Subscribers cannot afford the message fee");
        Topic storage t = topics[topicName];
        t.messages.push(message);

        // Deduct balance from each subscriber and emit an event
        for (uint i = 0; i < t.subscribers.length; i++) {
            address subscriber = t.subscribers[i];
            t.subscriberToBalance[subscriber] -= 0.005 ether;
            emit MessageReceived(topicName, message, subscriber);
        }
    }

    // Helper function to check if an address is a publisher of a topic
    function isPublisher(address publisher, string memory topicName) private view returns (bool) {
        address[] memory publishers = topics[topicName].publishers;

        for (uint i = 0; i < publishers.length; i++) {
            if (publishers[i] == publisher) {
                return true;
            }
        }
        return false;
    }


    // Function to allow a user to subscribe to a topic
    function subscribe(string memory topicName) public payable {
        require(msg.value == 0.5 ether, "Subscription requires exactly 0.5 ether");
        Topic storage t = topics[topicName];
        t.subscribers.push(msg.sender);
        t.subscriberToBalance[msg.sender] = msg.value;
    }

    // Function to allow a user to unsubscribe from a topic
    function unsubscribe(string memory topicName) public {
        require(isSubscriber(msg.sender, topicName), "You are not subscribed to this topic");
        
        Topic storage t = topics[topicName];
        for (uint i = 0; i < t.subscribers.length; i++) {
            if (t.subscribers[i] == msg.sender) {
                t.subscribers[i] = t.subscribers[t.subscribers.length - 1];
                t.subscribers.pop();
                payable(msg.sender).transfer(t.subscriberToBalance[msg.sender]);
                delete t.subscriberToBalance[msg.sender];
                break;
            }
        }
    }

     // Helper function to check if an address is a subscriber of a topic
    function isSubscriber(address subscriber, string memory topicName) private view returns (bool) {
        address[] memory subscribers = topics[topicName].subscribers;
        for (uint i = 0; i < subscribers.length; i++) {
            if (subscribers[i] == subscriber) {
                return true;
            }
        }
        return false;
    }

    // TODO: useless?
    // // This event will be emitted when a message needs to be sent to a subscriber
    // event SendMessage(string indexed topic, string message, address indexed subscriber);
    // // Call this function to emit an event that the broker will listen to
    // function sendToSubscriber(string memory topicName, string memory message, address subscriber) public {
    //     require(isSubscriber(msg.sender, topicName), "Caller is not the publisher for this topic");

    //     // Emit an event that the off-chain broker will listen for
    //     emit SendMessage(topicName, message, subscriber);
    // }
}
