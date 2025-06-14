'use client';

import React, { useState, useEffect } from 'react';
import { logClick } from '@/services/analyticsLogger';

interface SeatSelectorProps {
  rows: number;
  seatsPerRow: number;
  occupiedSeats: string[];
  seatPrices: {
    regular: number;
    premium: number;
    executive: number;
  };
  onSeatSelection: (seats: string[], totalPrice: number) => void;
}

interface SeatInfo {
  id: string;
  type: 'regular' | 'premium' | 'executive';
  price: number;
  occupied: boolean;
  selected: boolean;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({
  rows,
  seatsPerRow,
  occupiedSeats,
  seatPrices,
  onSeatSelection,
}) => {
  const [seats, setSeats] = useState<SeatInfo[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    // Generate seat layout only once
    const seatLayout: SeatInfo[] = [];
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let row = 0; row < rows; row++) {
      const rowLabel = rowLabels[row];
      
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatId = `${rowLabel}${seat}`;
        let seatType: 'regular' | 'premium' | 'executive' = 'regular';
        
        // Define seat types based on row position
        if (row < 3) {
          seatType = 'regular';
        } else if (row < rows - 2) {
          seatType = 'premium';
        } else {
          seatType = 'executive';
        }

        seatLayout.push({
          id: seatId,
          type: seatType,
          price: seatPrices[seatType],
          occupied: occupiedSeats.includes(seatId),
          selected: false,
        });
      }
    }

    setSeats(seatLayout);
  }, [rows, seatsPerRow, occupiedSeats, seatPrices]); // Remove selectedSeats from dependencies

  // Update seat selection state when selectedSeats changes
  useEffect(() => {
    setSeats(prevSeats =>
      prevSeats.map(seat => ({
        ...seat,
        selected: selectedSeats.includes(seat.id)
      }))
    );
  }, [selectedSeats]);

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.occupied) return;

    let newSelectedSeats: string[];
    
    if (selectedSeats.includes(seatId)) {
      // Deselect seat
      newSelectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
      // Select seat (max 8 seats)
      if (selectedSeats.length >= 8) {
        alert('You can select maximum 8 seats');
        return;
      }
      newSelectedSeats = [...selectedSeats, seatId];
    }

    setSelectedSeats(newSelectedSeats);

    // Calculate total price
    const totalPrice = newSelectedSeats.reduce((total, id) => {
      const seat = seats.find(s => s.id === id);
      return total + (seat ? seat.price : 0);
    }, 0);

    // Log seat selection
    logClick('seat-selection', '/book-movie', { 
      seatId, 
      action: selectedSeats.includes(seatId) ? 'deselect' : 'select',
      totalSeats: newSelectedSeats.length,
      totalPrice 
    });

    onSeatSelection(newSelectedSeats, totalPrice);
  };

  const getSeatColor = (seat: SeatInfo) => {
    if (seat.occupied) return 'bg-gray-400 cursor-not-allowed text-gray-600';
    if (seat.selected) return 'bg-green-500 text-white border-green-400 border-2 shadow-lg';
    
    switch (seat.type) {
      case 'regular':
        return 'bg-blue-200 hover:bg-blue-300 cursor-pointer text-blue-800 border border-blue-300';
      case 'premium':
        return 'bg-yellow-200 hover:bg-yellow-300 cursor-pointer text-yellow-800 border border-yellow-300';
      case 'executive':
        return 'bg-purple-200 hover:bg-purple-300 cursor-pointer text-purple-800 border border-purple-300';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  return (
    <div className="glass-card rounded-xl p-6">
      {/* Screen */}
      <div className="mb-8">
        <div className="w-full h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-t-full mb-2"></div>
        <p className="text-center text-gray-300 text-sm">SCREEN</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-200 rounded mr-2 border border-blue-300"></div>
          <span className="text-gray-300">Regular (₹{seatPrices.regular})</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-200 rounded mr-2 border border-yellow-300"></div>
          <span className="text-gray-300">Premium (₹{seatPrices.premium})</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-200 rounded mr-2 border border-purple-300"></div>
          <span className="text-gray-300">Executive (₹{seatPrices.executive})</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
          <span className="text-gray-300">Occupied</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2 border-2 border-green-400"></div>
          <span className="text-gray-300">Selected</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-center mb-2">
              {/* Row Label */}
              <div className="w-8 text-center font-medium text-gray-300 mr-4">
                {rowLabels[rowIndex]}
              </div>
              
              {/* Seats */}
              <div className="flex gap-1">
                {seats
                  .filter(seat => seat.id.startsWith(rowLabels[rowIndex]))
                  .map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat.id)}
                      disabled={seat.occupied}
                      className={`w-8 h-8 rounded text-xs font-medium transition-all duration-200 ${getSeatColor(seat)} ${
                        seat.selected ? 'transform scale-110' : ''
                      } ${
                        !seat.occupied && !seat.selected ? 'hover:transform hover:scale-105' : ''
                      }`}
                      data-testid={`seat-${seat.id}`}
                      title={`${seat.id} - ${seat.type} - ₹${seat.price}${seat.occupied ? ' (Occupied)' : ''}${seat.selected ? ' (Selected)' : ''}`}
                    >
                      {seat.id.slice(1)}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <h3 className="font-semibold text-green-300 mb-2">Selected Seats</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSeats.map((seatId) => {
              const seat = seats.find(s => s.id === seatId);
              return (
                <span
                  key={seatId}
                  className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm border border-green-500/30"
                >
                  {seatId} (₹{seat?.price})
                </span>
              );
            })}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-300">
              Total: {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}
            </span>
            <span className="font-bold text-green-300 text-lg">
              ₹{selectedSeats.reduce((total, id) => {
                const seat = seats.find(s => s.id === id);
                return total + (seat ? seat.price : 0);
              }, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;