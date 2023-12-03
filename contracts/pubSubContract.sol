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
    event MessageReceived(string indexed topic, string message, address indexed subscriber);

    // Allow publishers to advertise a topic
    function advertise(string memory topicName) public {
        Topic storage t = topics[topicName];
        t.name = topicName;
        t.publishers.push(msg.sender);
    }

    // Allow publishers to publish a message to a topic
    function publish(string memory topicName, string memory message) public {
        require(isPublisher(msg.sender, topicName), "Only publishers can publish messages");

        Topic storage t = topics[topicName];
        t.messages.push(message);

        // Deduct balance from each subscriber and emit an event
        for (uint i = 0; i < t.subscribers.length; i++) {
            address subscriber = t.subscribers[i];
            require(t.subscriberToBalance[subscriber] >= 0.005 ether, "Insufficient balance for message fee");
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
}
