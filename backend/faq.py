# import ollama # package


# def academic_chatbot():# define = function
#     messages = []

#     print("Academic Bot: Hello! Ask me anything about university life or studies. (Type 'exit' to quit.)")

#     while True: # LOOPING
#         user_input = input("You: ") #input from user
#         if user_input.lower() == 'exit':
#             break

#         messages.append({'role': 'user', 'content': user_input}) # ADD

#         # Correct usage: response contains a "message" dict
#         response = ollama.chat(model='backend', messages=messages)
#         assistant_response = response["message"]["content"]

#         print(assistant_response)

#         print(f"Academic Bot: {assistant_response}")
#         messages.append({'role': 'assistant',
#         'content': assistant_response})

# if __name__ == "__main__":
#     academic_chatbot()

# # dunder = double underscore




