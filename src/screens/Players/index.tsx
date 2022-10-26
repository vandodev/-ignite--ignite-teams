import { FlatList, Alert } from 'react-native';
import { useState} from 'react';
import { ButtonIcon } from '@components/ButtonIcon';
import { Filter } from '@components/Filter';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Input } from '@components/Input';
import { Container,Form, HeaderList, NumberOfPlayers } from './styles';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { useRoute } from '@react-navigation/native';
import { AppError } from '@utils/AppError';
import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroup } from '@storage/player/playersGetByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';

type RouteParams = {
  group: string;
}

export function Players() {
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
    const [newPlayerName, setNewPlayerName] = useState('');

    const route = useRoute();
    const {group} = route.params as RouteParams;

    async function handleAddPlayer() {
        if(newPlayerName.trim().length === 0) {
          return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.');
        }

        const newPlayer = {
          name: newPlayerName,
          team,
        }

        try {
          await playerAddByGroup(newPlayer, group);
          const players = await playersGetByGroup(group);
          console.log(players);
        
        } catch (error) {
          if(error instanceof AppError){
            Alert.alert('Nova pessoa', error.message);
          } else {
            console.log(error);
            Alert.alert('Nova pessoa', 'Não foi possível adicionar.');
          }
        }
      }

      async function fetchPlayersByTeam() {
        try {
          const playersByTeam = await playersGetByGroupAndTeam(group, team);
          setPlayers(playersByTeam);
        } catch (error) {
          console.log(error);
          Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.');
        } 
      }

    return(
        <Container>
            <Header showBackButton />

            <Highlight 
                // title={route.params.groups}
                title={group}
                subtitle="adicione a galera e separe os times"
             />
            <Form>
              
                <Input 
                  placeholder='Nome da pessoa' 
                  autoCorrect={false}
                  onChangeText={setNewPlayerName}
                 />

                <ButtonIcon 
                  icon='add'
                  onPress={handleAddPlayer} 
                />
            </Form>

        <HeaderList>
                <FlatList 
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter 
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
            )}
             horizontal
            />

             <NumberOfPlayers>
                {players.length}
             </NumberOfPlayers>
        </HeaderList>

        <FlatList 
            data={players}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <PlayerCard 
                name={item} 
              />
            )}
            
            ListEmptyComponent={() => (
              <ListEmpty message="Não há pessoas nesse time" />
            )}
           
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
          />

          <Button 
            title="Remover Turma"
            type="SECONDARY"
          />

        </Container>
    )
}