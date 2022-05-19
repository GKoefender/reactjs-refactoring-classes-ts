import { Component, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { foodProps } from '../../types'

import { FoodsContainer } from './styles';

type foodInputProps = Omit<foodProps, 'id' | 'available'>

interface editingFoodProps {
  editingFood: foodProps,
  editModalOpen: boolean
}

function Dashboard () {
  const [foods, setFoods] = useState<foodProps[]>([])
  const [editingFood, setEditingFood] = useState<editingFoodProps>({} as editingFoodProps)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

  useEffect(() => {
    api.get<foodProps[]>('/foods')
      .then(response => setFoods(response.data))
  }, [])

  async function handleAddFood (food: foodInputProps) {
    try {
      const response = await api.post<foodProps>('/foods', {
        ...food,
        available: true,
      });

      const foodAdded = response.data

      setFoods([...foods, foodAdded])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood (food: foodInputProps) {
    try {
      const response = await api.put<foodProps>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodUpdated = response.data

      const foodsUpdated = foods.map(food =>
        food.id !== foodUpdated.id ? food : foodUpdated,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood (foodId: number) {
    try {
      await api.delete(`/foods/${foodId}`);

      const foodsFiltered = foods.filter(food => food.id !== foodId);

      setFoods(foodsFiltered)
    } catch (err) {
      console.log(err);
    }
  }

  function toggleModal () { setModalOpen(!modalOpen) }
  function toggleEditModal () { setEditModalOpen(!editModalOpen) }

  function handleEditFood (food: foodProps) {
    setEditingFood({ editingFood: food, editModalOpen: true })
  }

  return (
    <>
      <Header openModal={this.toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={this.toggleModal}
        handleAddFood={this.handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={this.toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={this.handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={this.handleDeleteFood}
              handleEditFood={this.handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
