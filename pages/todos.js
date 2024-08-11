import apiFetch from '../functions/apiFetch';
import Alert from '../components/Alert';
import { Colours, Typography } from '../definitions';
import PageLayout from '../components/PageLayout';
import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

const Todos = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); //to make sure the page is ready

  const ConvertDate = (dateCreated) => {
    return new Date(dateCreated).toLocaleDateString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const GetDisplayMessage = (todoElement) => {
    return `Todo: ${todoElement.name} <====== ${
      Boolean(todoElement.completion) ? "DONE!" : "INPROGRESS"
    } =====> Started On: ${ConvertDate(todoElement.created)}`;
  };

  const CompleteTodo = async (todoID) => {
    try {
      let response = await apiFetch("/todo/complete", {
        body: {
          todoID: todoID,
        },
        method: "POST",
      });
      if (response.status === 201) {
        //frontend should handle more when applicable
        setData(
          data.map((element) => {
            return element.todoID === todoID
              ? { ...element, completion: true }
              : element;
          })
        );
        return;
      }
      throw new Error("Modification Failed");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const UpdateTodos = async () => {
      try {
        let resultTodos = await apiFetch("/todo", {
          method: "GET",
        });
        if (!resultTodos || !resultTodos.body) {
          throw new error("Invalid outcome");
        }
        setData(resultTodos.body);
      } catch (err) {
        console.error("Error when getting todos" + err);
      } finally {
        setLoading(false);
      }
    };

    UpdateTodos();
  }, []);

  return (
    !loading && (
      <PageLayout title="My Todos">
        <Container>
          <span>Click on close button to complete</span>
          <ul>
            {data
              .sort(
                (a, b) => Date.parse(a.dateCreated) - Date.parse(b.dateCreated)
              )
              .map((element, index) => {
                return (
                  <li key={index}>
                    <Alert
                      message={[index, "- ", GetDisplayMessage(element)]}
                      onClose={() => {
                        !element.completion && CompleteTodo(element.todoID);
                      }}
                      variant={element.completion ? "success" : undefined}
                    />
                  </li>
                );
              })}
          </ul>
        </Container>
      </PageLayout>
    )
  );
};

export default Todos;

const Container = styled.div`
  width: 100%;

  h1 {
    color: ${Colours.BLACK};
    font-size: ${Typography.HEADING_SIZES.M};
    font-weight: ${Typography.WEIGHTS.LIGHT};
    line-height: 2.625rem;
    margin-bottom: 2rem;
    margin-top: 1rem;
  }

  .input {
    margin-bottom: 0.5rem;
  }

  .loginButton {
    margin-bottom: 2.0625rem;
  }

  .signUpOptions {
    margin-bottom: 2rem;

    .signUpOption {
      margin-bottom: 0.5rem;
    }
  }
`;
